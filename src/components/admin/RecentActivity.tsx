import { 
  UserIcon, 
  StarIcon, 
  NewspaperIcon, 
  ChatBubbleLeftIcon 
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

export interface Activity {
  type: 'user' | 'star' | 'news' | 'comment';
  id: string;
  title: string;
  subtitle: string;
  status?: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'user':
      return UserIcon;
    case 'star':
      return StarIcon;
    case 'news':
      return NewspaperIcon;
    case 'comment':
      return ChatBubbleLeftIcon;
  }
};

const getActivityDescription = (activity: Activity) => {
  switch (activity.type) {
    case 'user':
      return 'New user registered';
    case 'star':
      return 'Star profile added';
    case 'news':
      return 'News article created';
    case 'comment':
      return activity.status === 'pending' ? 'New comment pending review' : 'New comment added';
  }
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="flow-root px-4 py-5">
      <ul role="list" className="-mb-8">
        {activities.map((activity, activityIdx) => {
          const Icon = getActivityIcon(activity.type);
          return (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-700"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`
                      h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-gray-900
                      ${activity.type === 'user' ? 'bg-blue-900/20 text-blue-400' : ''}
                      ${activity.type === 'star' ? 'bg-yellow-900/20 text-yellow-400' : ''}
                      ${activity.type === 'news' ? 'bg-green-900/20 text-green-400' : ''}
                      ${activity.type === 'comment' ? 'bg-purple-900/20 text-purple-400' : ''}
                    `}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-300">
                        {getActivityDescription(activity)}{' '}
                        <span className="font-medium text-white">{activity.title}</span>
                        {activity.subtitle && (
                          <span className="text-gray-500 ml-1">
                            {activity.type === 'comment' ? `"${activity.subtitle}"` : activity.subtitle}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time>{formatDistanceToNow(new Date(activity.timestamp))} ago</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 