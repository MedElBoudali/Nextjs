import { useRouter } from 'next/router';
import { useGetPostQuery } from '../../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import PropTypes from 'prop-types';
import Navbar from '../../components/layouts/Navbar';

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
      <Navbar/>
      <h1>Post id: {intId}</h1>
      <h1>Title: {data?.getPost?.title}</h1>
      <h1>textSnippet: {data?.getPost?.textSnippet}</h1>
      <h1>Post: {data?.getPost?.text}</h1>
      <h1>Likes: {data?.getPost?.points}</h1>
      <h1>Author: {data?.getPost?.author.username}</h1>
      <h1>Author email: {data?.getPost?.author.email}</h1>
      <h1>Fate: {data?.getPost?.createdAt}</h1>
    </div>
  );
};

CurrentPost.propTypes = {};

export default withUrqlClient(createUrqlClient, { ssr: true })(CurrentPost);
