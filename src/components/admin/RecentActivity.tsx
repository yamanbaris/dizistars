import { 
  UserIcon, 
  StarIcon, 
  NewspaperIcon, 
  ChatBubbleLeftIcon 
} from '@heroicons/react/24/outline';

const activities = [
  {
    id: 1,
    type: 'user',
    description: 'New user registered',
    name: 'John Doe',
    time: '5 minutes ago',
    icon: UserIcon,
  },
  {
    id: 2,
    type: 'star',
    description: 'Star profile updated',
    name: 'Çağatay Ulusoy',
    time: '10 minutes ago',
    icon: StarIcon,
  },
  {
    id: 3,
    type: 'news',
    description: 'New article published',
    name: 'Latest Turkish Drama News',
    time: '30 minutes ago',
    icon: NewspaperIcon,
  },
  {
    id: 4,
    type: 'comment',
    description: 'New comment added',
    name: 'On: Çağatay Ulusoy Profile',
    time: '1 hour ago',
    icon: ChatBubbleLeftIcon,
  },
];

export default function RecentActivity() {
  return (
    <div className="flow-root px-4 py-5">
      <ul role="list" className="-mb-8">
        {activities.map((activity, activityIdx) => {
          const Icon = activity.icon;
          return (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center ring-8 ring-white">
                      <Icon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {activity.description}{' '}
                        <span className="font-medium text-gray-900">{activity.name}</span>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time>{activity.time}</time>
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