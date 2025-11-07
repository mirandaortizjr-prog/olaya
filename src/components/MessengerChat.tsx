import { MessengerPage } from "@/pages/MessengerPage";

interface MessengerChatProps {
  coupleId: string;
  currentUserId: string;
  partnerName: string;
  onClose: () => void;
}

export const MessengerChat = ({ coupleId, currentUserId, partnerName, onClose }: MessengerChatProps) => {
  return (
    <MessengerPage
      coupleId={coupleId}
      currentUserId={currentUserId}
      partnerName={partnerName}
      onClose={onClose}
    />
  );
};
