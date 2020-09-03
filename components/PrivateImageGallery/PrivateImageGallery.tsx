import { gql, useQuery, useMutation } from '@apollo/client';
import { Button, Card, CardMedia } from '@material-ui/core';

import styles from './PrivateImageGallery.module.css';
import Router from 'next/router'


// Fetch images from backend with gql query and token.
const GET_USER_QUERY = gql`
  query GetUser($token: String!) {
    getUser(token: $token) {
      images {
        id
        url
        privateImg
        userId
      }
    }
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
    // For GET_USER_QUERY useQuery
    refetch()

  }

  const [deletePhoto] = useMutation(DELETE_IMAGES_QUERY)
  const handleDeletePhoto = async (imgUrl) => {
    await deletePhoto({
      variables: {
        imgUrl: imgUrl,
        token: localStorage.getItem("token")
      }
    })
    // For GET_USER_QUERY useQuery
    refetch()
  }

  let userToken = '';
  if (typeof window !== 'undefined') {
    userToken = localStorage.getItem('token');
  }

  const { data, loading, error, refetch } = useQuery(GET_USER_QUERY, {
    variables: { token: userToken },
    pollInterval: 1000,
  });

  if (error) return <div>Error :(</div>

  if (loading) return <div>Loading...</div>;

  console.log(data.getUser.images)

  if (data) {
    // Custom sort to ensure that entires don't move around when privateImg is updated.
    const sortedImages = [...data.getUser.images]
    sortedImages.sort((x, y) => {
      if (x.id > y.id) return 1
      else return -1
    })

    return (
      <div className={styles.container}>
        {sortedImages.map((image, key) => {
          return (
            <div key={key} className={styles.cardWrapper}>
              <Card className={image.privateImg ? styles.cardPrivate : styles.card} key={key}>
                <div>
                  <CardMedia
                    component="img"
                    alt="Picture"
                    height="300"
                    image={image.url}
                    title="Picture"
                  />
                </div>
                <div className={styles.visibility}>
                  {image.privateImg && (
                    <div>
                      Visibility: Private
                    </div>
                  )}
                  {!image.privateImg && (
                    <div>
                      Visibility: Public
                    </div>
                  )}
                </div>
                <div className={styles.buttons}>
                  {image.privateImg && (
                    <Button onClick={() => handlePhotoVisibility(image.url)}>Make Public</Button>
                  )}
                  {!image.privateImg && (
                    <Button onClick={() => handlePhotoVisibility(image.url)}>Make Private</Button>
                  )}
                  <Button onClick={() => handleDeletePhoto(image.url)}>Delete Image</Button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    );
  }
};

