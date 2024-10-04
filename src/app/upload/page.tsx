
import { upload } from '@/app/_actions/postAction';

const UploadPage = () => {
  return (
    <main>
      <div>Upload File</div>
      <form action={upload}>
        <input type='file' name='file' accept='image/*,video/*' />
        <input type='submit' value='Upload' />
      </form>
      <div className='rounded-lg overflow-hidden w-fit ml-4 mt-8'>
        <video width='300' controls>
          <source
            src='https://study-ai.s3.eu-north-1.amazonaws.com/uploads/abeera_ringtone.mp4'
            type='video/mp4'
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </main>
  );
};

export default UploadPage;
