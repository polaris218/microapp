import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const SELECTION_TYPES = [
  "Original",
  "Square of original size",
  "Small",
  "All three",
];

const SMALL_SIZE = { width: 256, height: 256 };

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  input: {
    display: "none",
  },
  media: {
    height: "100%",
    width: "100%",
  },
  actionarea: {
    background: "#a5a5a5",
  },
  label: {
    width: "100%",
  },
}));

const UploadImage = () => {
  const classes = useStyles();
  const [base64Image, setBase64Image] = useState(null);
  const [displaySize, setDisplaySize] = useState(SMALL_SIZE);
  const [orgSize, setOrgSize] = useState(displaySize);
  const [squareCardSize, setSquareCardSize] = useState(displaySize);
  const [type, setType] = useState(SELECTION_TYPES[0]);

  function setImageSize(imgSize) {
    const maxLength = Math.max(imgSize.width, imgSize.height);
    switch (type) {
      case SELECTION_TYPES[0]:
        setSquareCardSize(imgSize);
        return setDisplaySize(imgSize);
      case SELECTION_TYPES[1]:
        setDisplaySize(imgSize);
        return setSquareCardSize({ width: maxLength, height: maxLength });
      case SELECTION_TYPES[2]:
        setSquareCardSize(SMALL_SIZE);
        return setDisplaySize(SMALL_SIZE);
      case SELECTION_TYPES[3]:
        setDisplaySize(imgSize);
        return setSquareCardSize({ width: maxLength, height: maxLength });
      default:
        return;
    }
  }

  useEffect(() => {
    let img = new Image();
    img.src = base64Image;
    img.onload = () => {
      const imgSize = { width: img.width, height: img.height };
      setOrgSize(imgSize);
      setImageSize(imgSize);
    };
  }, [base64Image]);

  useEffect(() => {
    if (base64Image) {
      setImageSize(orgSize);
    }
  }, [type]);

  const handleSetType = (displayType) => {
    setType(displayType);
  };

  const handleImageChange = (event) => {
    let reader = new FileReader();

    if (event.currentTarget.files[0]) {
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(event.currentTarget.files[0]);
    }
  };

  return (
    <div className={classes.root}>
      <DisplayTypeSelection onSetType={handleSetType} type={type} />
      <input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        onChange={handleImageChange}
      />
      <label
        htmlFor="contained-button-file"
        id="file"
        name="file"
        className={classes.label}
      >
        {type !== SELECTION_TYPES[3] ? (
          <DisplayImage
            base64Image={base64Image}
            selectedType={type}
            squareCardSize={squareCardSize}
            displaySize={displaySize}
          />
        ) : (
          [
            { squareCardSize: orgSize, displaySize: orgSize },
            { squareCardSize: squareCardSize, displaySize: orgSize },
            { squareCardSize: SMALL_SIZE, displaySize: SMALL_SIZE },
          ].map(({ squareCardSize, displaySize }) => (
            <DisplayImage
              base64Image={base64Image}
              squareCardSize={squareCardSize}
              displaySize={displaySize}
            />
          ))
        )}
      </label>
    </div>
  );
};

export default UploadImage;

export const DisplayImage = ({ base64Image, squareCardSize, displaySize }) => {
  const classes = useStyles();

  return (
    <Card style={squareCardSize ? { ...squareCardSize } : {}}>
      <CardActionArea
        className={classes.actionarea}
        style={base64Image ? { ...displaySize } : {}}
        component="span"
      >
        {base64Image ? (
          <CardMedia image={base64Image} className={classes.media} />
        ) : (
          <Button>Upload Image</Button>
        )}
      </CardActionArea>
    </Card>
  );
};

export const DisplayTypeSelection = ({ onSetType, type }) => {
  const classes = useStyles();

  const handleChange = (event) => {
    onSetType(event.target.value);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel>Methods</InputLabel>
      <Select value={type} onChange={handleChange}>
        {SELECTION_TYPES.map((el) => (
          <MenuItem value={el} key={el}>
            {el}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
