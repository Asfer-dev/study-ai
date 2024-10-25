import { chatHrefConstructor, cn } from "@/lib/utils";
import { FC } from "react";
import { toast, type Toast } from "react-hot-toast";
import ProfileImage from "./ProfileImage";

interface UnseenFriendRequestToastProps {
  t: Toast;
  sessionId: string;
  senderId: string;
  senderImg: string;
  senderName: string;
  senderProfileColor?: string;
}

const UnseenFriendRequestToast: FC<UnseenFriendRequestToastProps> = ({
  t,
  senderId,
  sessionId,
  senderImg,
  senderName,
  senderProfileColor,
}) => {
  return (
    <div
      className={cn(
        "max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5",
        { "animate-appear": t.visible, "animate-disappear": !t.visible }
      )}
    >
      <a
        onClick={() => toast.dismiss(t.id)}
        href={`/connections`}
        className="flex-1 w-0 p-4"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 pt-0.5">
            <ProfileImage
              imgUrl={senderImg}
              profileName={senderName}
              profileColor={senderProfileColor}
            />
          </div>

          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              <b>{senderName}</b> sent you a{" "}
              <span className="text-focus">Friend Request</span>
            </p>
            {/* <p className="mt-1 text-sm text-gray-500">{senderMessage}</p> */}
          </div>
        </div>
      </a>

      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-focus hover:text-focus/90 focus:outline-none focus:ring-2 focus:ring-focus"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UnseenFriendRequestToast;
