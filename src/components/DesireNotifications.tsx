import { ScrollArea } from "@/components/ui/scroll-area";

interface DesireNotificationsProps {
  coupleId: string;
  userId: string;
  partnerName: string;
}

export const DesireNotifications = ({ coupleId, userId, partnerName }: DesireNotificationsProps) => {
  return (
    <ScrollArea className="h-24">
      <div className="space-y-1.5 pr-2">
        <p className="text-xs text-amber-700 dark:text-amber-300 text-center py-4">
          No recent desires
        </p>
      </div>
    </ScrollArea>
  );
};
