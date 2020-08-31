import { gql, useQuery, useMutation } from '@apollo/client';
import { Button, Card, CardMedia } from '@material-ui/core';

import styles from './PrivateImageGallery.module.css';
import Router from 'next/router'


// Fetch images from backend with gql query and token.
const GET_USER_IMAGES_QUERY = gql`
  query GetUserImagesQuery($token: String!) {
    getUserImages(token: $token)
  }
`;

const DELETE_IMAGES_QUERY = gql`
  mutation DeleteImagesQuery($imgUrl: String, $token: String) {
    deletePhoto(imgUrl: $imgUrl, token: $token)
  }
`;

const TOGGLE_IMAGE = gql`
  mutation ToggleImageVisibility($imgUrl: String, $token: String) {
    photoVisibility(imgUrl: $imgUrl, token: $token) 
  }
`;

export const PrivateImageGallery = (images: any) => {
  const [photoVisibility] = useMutation(TOGGLE_IMAGE)

  const handlePhotoVisibility = async (imgUrl) => {
    await photoVisibility({
      variables: {
        imgUrl: imgUrl,
        token: localStorage.getItem("token")
      }
    });
    Router.reload();
  }
  const [deletePhoto] = useMutation(DELETE_IMAGES_QUERY)
  const handleDeletePhoto = async (imgUrl) => {
    await deletePhoto({
      variables: {
        imgUrl: imgUrl,
        token: localStorage.getItem("token")
      }
    })
    Router.reload();
  }

  let userToken = 'asdasd';
  if (typeof window !== 'undefined') {
    userToken = localStorage.getItem('token');
  }
  const { data, loading, error } = useQuery(GET_USER_IMAGES_QUERY, {
    variables: { token: userToken },
  });
  if (loading) return <div>Loading...</div>;

  // The data is encapsulated in a JSON.stringify call
  // so we need to decapsulate it with JSON.parse
  const parsedData = JSON.parse(data.getUserImages);

  return (
    <div className={styles.container}>
      {parsedData.map((image, key) => {
        return (
          <div key={key} className={styles.cardWrapper}>
            <Card className={styles.card} key={key}>
              <div>
                <CardMedia
                  component="img"
                  alt="Picture"
                  height="300"
                  image={image.url}
                  title="Picture"
                />
              </div>
              {image.privateImg && (
                <div>
                  Visibility: Private <Button onClick={() => handlePhotoVisibility(image.url)}>Make Public</Button>
                </div>
              )}
              {!image.privateImg && (
                <div>
                  Visibility: Public <Button onClick={() => handlePhotoVisibility(image.url)}>Make Private</Button>
                </div>
              )}
              <Button onClick={() => handleDeletePhoto(image.url)}>Delete Image</Button>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

