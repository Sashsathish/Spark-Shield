
import { Dashboard } from "@/components/Dashboard";
import { Layout } from "@/components/Layout";
import { Outlet } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      <Outlet></Outlet>
      {/* <Dashboard /> */}
    </Layout>
  );
};

export default Index;
