import { useCallback, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import Card from '@material-ui/core/Card';
import Router from 'next/router'
//import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import Button from '@material-ui/core/Button';
import { gql, useMutation } from '@apollo/client';
import { useDropzone } from "react-dropzone";
import styles from "./ImageUpload.module.css"

const UPLOAD_IMAGE = gql`
  mutation UploadImage($input: ImageInput!, $token: String!) {
    uploadImage(input: $input, token: $token) {
      id
    }
  }
`;

export const ImageUpload = () => {
  const [uploadImage] = useMutation(UPLOAD_IMAGE);
  const [files, setFiles] = useState([]);

  const onDeleteImage = () => {
    setFiles([])
  }

  const onDrop = useCallback(async (files) => {
    const reader = new FileReader();
    setFiles(
      files.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );

    const token = localStorage.getItem('token')
    await files.forEach(async (file) => {
      await reader.readAsDataURL(file);
      reader.onload = async () => {
        // console.log(reader.result)
        await uploadImage({
          variables: {
            input: { path: reader.result },
            token: token,
          }
        });
      }
      // Find way to remove this.
      Router.reload();
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ accept: 'image/*', onDrop, maxSize: 500122, });

  const thumbs = files.map((file) => (
    <div className={styles.thumbsContainer}>
      <div className={styles.thumb} key={file.name}>
        <div className={styles.thumbInner}>
          <img
            src={file.preview}
            className={styles.img}
          />
        </div>
      </div>
    </div>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  },
    [files]
  );

  return (
    <section className="container">
      <div className={styles.titleAlign}><h1 className={styles.alignText}>Upload An Image Of Your Favourite Movie Snacks <span className={styles.moveEmoji} aria-label="a party" role="img">🎉</span></h1></div>
      <Card className={styles.root}>
        <CardContent>
          <div className={styles.inputImage} {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <Button className={styles.button} variant="contained"><div><div ><PublishRoundedIcon className={styles.icon} /> </div><div>Drag and drop one photo at a time here / click to select photo</div><div className={styles.smallText}>Images must be 500KB or less</div></div></Button>
          </div>
          <aside className={styles.thumbsContainer}>
            {thumbs}
          </aside>
        </CardContent>
      </Card>
    </section>
  );
};

