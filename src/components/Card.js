import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import inputImage from "../assets/Placeholder.jpg";
import { firestore, storage } from "../firebase";
import { addDoc, collection, getDocs } from "@firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import CircularProgress from "@mui/material/CircularProgress";
import "./Card.css";

const AddCard = () => {
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imageURLs, setImageUrls] = useState([]);
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState("New Title");
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  console.log("cards", cards);
  const changeTitle = (title) => {
    setTitle(title);
  };
  const refMessages = collection(firestore, "messages");

  const handleSave = async (e) => {
    e.preventDefault();
    const storageRef = ref(storage, `files/${images[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, images[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progresspercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progresspercent);
        setUploading(true);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
          let data = {
            description: description,
            imageURL: downloadURL,
          };
          try {
            addDoc(refMessages, data);
          } catch (e) {
            console.log(e);
          }
          setUploading(false);
          setDescription("");
          setImages([]);
          setImageUrls([]);
          readCards();
          setTitle("New Title");
        });
      }
    );
  };
  const readCards = async () => {
    const data = await getDocs(refMessages);
    setCards(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  useEffect(() => {
    readCards();
  }, []);

  console.log(cards);
  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls = [];
    images.forEach((image) => newImageUrls.push(URL.createObjectURL(image)));
    setImageUrls(newImageUrls);
  }, [images]);
  const onImageChange = (e) => {
    setImages([...e.target.files]);
  };

  return (
    <div>
      <Card
        className="cardClass"
        sx={{
          maxWidth: 345,
          margin: 10,
          border: 1,
          borderRadius: 4,
          borderColor: "black",
        }}
      >
        <CardContent>
          <Typography
            tag="h5"
            onClick={() => changeTitle("Hello World")}
            sx={{ color: "#ff8a65" }}
            gutterBottom
            variant="h4"
            component="div"
          >
            {title}
          </Typography>
          <textarea
            style={{
              width: "300px",
              height: "120px",
              fontSize: "16px",
              border: "none",
              outline: "none",
            }}
            placeholder="New description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </CardContent>
        <div className="picture">
          <input
            className="inputClass"
            type="file"
            multiple
            accept="image/*"
            onChange={onImageChange}
          />

          {imageURLs.length > 0 ? (
            imageURLs.map((imageSrc, i) => (
              <CardMedia
                key={i}
                sx={{ height: 240 }}
                image={imageSrc}
                title="picture"
              />
            ))
          ) : (
            <CardMedia
              sx={{ height: 240, marginleft: 100 }}
              image={inputImage}
              title="picture"
            />
          )}
        </div>

        <CardActions className="button">
          <Button
            disabled={uploading}
            type="button"
            onClick={handleSave}
            style={{ height: "35px", backgroundColor: "green" }}
            size="medium"
          ></Button>
        </CardActions>
      </Card>
      {cards.map((c) => (
        <Card
          className="cardClass"
          sx={{
            maxWidth: 345,
            margin: 10,
            border: 1,
            borderColor: "black",
            borderRadius: 4,
          }}
        >
          <Typography
            tag="h5"
            gutterBottom
            variant="h4"
            component="div"
            style={{ color: "#ff8a65", marginLeft: "20px" }}
          >
            Hello World
          </Typography>
          <p className="text">{c.description}</p>
          <CardMedia
            className="picture"
            sx={{ height: 240 }}
            image={c.imageURL}
            title="picture"
          />
        </Card>
      ))}
    </div>
  );
};

export default AddCard;
