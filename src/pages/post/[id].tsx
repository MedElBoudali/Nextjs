import { useRouter } from 'next/router';
import { useGetPostQuery } from '../../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import Navbar from '../../components/layouts/Navbar';
import EditDeletePostBtns from '../../components/EditDeletePostBtns';

const CurrentPost: React.FC<{}> = () => {
  const router = useRouter();
  const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const [{ fetching, data }] = useGetPostQuery({
    variables: {
      id: intId
    }
  });
  if (!data && !fetching) {
    return (
      <div>
        <p>Something Went Wrong. Try Again</p>
      </div>
    );
  }
  return (
    <div>
      {data?.getPost && !fetching ? (
        <div>
          <head>
            <title>{!data?.getPost ? 'Loading ...' : data.getPost.title}</title>
          </head>
          <Navbar />
          <EditDeletePostBtns postId={intId} authorId={data.getPost.author.id} />
          <h1>Post id: {intId}</h1>
          <h1>Title: {data.getPost.title}</h1>
          <h1>textSnippet: {data.getPost.textSnippet}</h1>
          <h1>Post: {data.getPost.text}</h1>
          <h1>Likes: {data.getPost.points}</h1>
          <h1>Author: {data.getPost.author.username}</h1>
          <h1>Author email: {data.getPost.author.email}</h1>
          <h1>Fate: {data.getPost.createdAt}</h1>
        </div>
      ) : (
        <div>Loiding ...</div>
      )}
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(CurrentPost);
