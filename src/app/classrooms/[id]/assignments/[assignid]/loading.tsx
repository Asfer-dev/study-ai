import { Metadata } from "next";
import Skeleton from "react-loading-skeleton";

export const metadata: Metadata = {
  title: "Classroom Assignment | study.ai",
};

interface AssignmentPageProps {
  params: { id: string; assignid: string };
}

const AssignmentPage = async ({ params }: AssignmentPageProps) => {
  return (
    <div>
      <div className="flex justify-between mb-8">
        <div className="text-3xl font-semibold mb-4">
          <Skeleton height={30} width={600} />
        </div>
        <div className="flex flex-col gap-4 mb-6">
          <Skeleton height={20} width={150} />
        </div>
      </div>
      {/* <h3 className="text-lg mt-4">Description:</h3> */}
      <div className="max-w-[700px] whitespace-pre-wrap mb-6">
        <Skeleton height={20} width={700} />
        <Skeleton count={3} height={20} width={500} />
      </div>
      <div>
        <Skeleton height={30} width={400} />
      </div>
    </div>
  );
};

export default AssignmentPage;
