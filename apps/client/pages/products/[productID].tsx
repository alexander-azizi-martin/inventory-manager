import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import ProductEditor from '~/components/ProductEditor';

const New: NextPage = () => {
  const router = useRouter();
  const { productID } = router.query;

  if (productID == undefined) {
    return (
      <div className="flex justify-center items-center w-[100vw] h-[100vh]">
        <CircularProgress />
      </div>
    );
  }

  return <ProductEditor productID={productID as string} />;
};

export default New;
