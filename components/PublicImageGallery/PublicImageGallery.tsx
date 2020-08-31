import { useQuery, gql } from '@apollo/client';
import { Card, CardMedia } from '@material-ui/core';

import styles from './PublicImageGallery.module.css';

const imageData = [{ url: '1' }, { url: '2' }, { url: '3' }];

const GET_ALL_IMAGES_QUERY = gql`
  query {
    getAllUserImages
  }
`;

export const PublicImageGallery = (images: any) => {
  const { data, loading, error } = useQuery(GET_ALL_IMAGES_QUERY);
  if (loading) return <div>Loading...</div>;

  const userImages = JSON.parse(data.getAllUserImages);

  return (
    <div className={styles.container}>

      {userImages.map((image, key) => {
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
            </Card>
          </div>
        );
      })}
    </div>
  );
};

