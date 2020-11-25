import { useRouter } from 'next/router';
import { useGetPostQuery } from '../../generated/graphql';
import PropTypes from 'prop-types';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';

interface CurrentPostProps {}

const CurrentPost: React.FC<CurrentPostProps> = props => {
  const router = useRouter();
  const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const [{ fetching, data }] = useGetPostQuery({
    variables: {
      id: intId
    }
  });
  if (fetching) <div>Loading ...</div>;
  return (
    <div>
      <head>
        <meta charSet='utf-8' />
        <link rel='icon' type='image/x-icon' href='/favicon.png' />
        <title>post title here</title>
        <meta name='title' content='COVID-19 Tracker' />
        <meta name='description' content='Track the spread of the Coronavirus Covid-19 outbreak' />
      </head>
      <h1>Post id: {intId}</h1>
      <h1>Title: {data?.getPost?.text}</h1>
    </div>
  );
};

CurrentPost.propTypes = {};

export default withUrqlClient(createUrqlClient, { ssr: true })(CurrentPost);
