import {
    LockClosedIcon,
    ClockIcon,
    UserGroupIcon,
    InboxIcon,
  } from '@heroicons/react/24/outline';
  import { lusitana } from '@/app/ui/fonts';
  import { fetchCardData } from '@/app/lib/data';
  
  const iconMap = {
    closed: LockClosedIcon,
    customers: UserGroupIcon,
    open: ClockIcon,
    jobs: InboxIcon,
  };

  
  export default async function CardWrapper() {
    const {
      numberOfJobs,
      totalPendingJobs,
      totalClosedJobs,
    } = await fetchCardData();
    return (
      <>
        {/* NOTE: comment in this code when you get to this point in the course */}
  
        <Card title="Closed" value={totalClosedJobs} type="closed" />
        <Card title="Open" value={totalPendingJobs} type="open" />
        <Card title="Total Jobs" value={numberOfJobs} type="jobs" />
        {/* <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </>
    );
  }
  
  export function Card({
    title,
    value,
    type,
  }: {
    title: string;
    value: number | string;
    type: 'jobs' | 'customers' | 'open' | 'closed';
  }) {
    const Icon = iconMap[type];
  
    return (
      <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
        <div className="flex p-4">
          {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
          <h3 className="ml-2 text-sm font-medium">{title}</h3>
        </div>
        <p
          className={`${lusitana.className}
            truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
        >
          {value}
        </p>
      </div>
    );
  }
  