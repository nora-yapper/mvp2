import React from 'react';
import Sidebar from './Sidebar';

const Page = () => {
  const sidebarNavigation = [
    { label: "Dashboard", onClick: () => {} },
    { label: "Command Deck", onClick: () => (window.location.href = "/homebase") },
    { label: "Settings", onClick: () => {} },
    // /** rest of code here **/
  ];

  return (
    <div>
      <Sidebar navigation={sidebarNavigation} />
      {/* /** rest of code here **/ */}
    </div>
  );
};

export default Page;
