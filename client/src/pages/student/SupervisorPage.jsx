import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  requestSupervisor,
  fetchAllSupervisor,
  getSupervisor,
  fetchProject,
} from "../../store/slices/studentSlice";

const SupervisorPage = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { project, supervisor, supervisors } = useSelector(
    (state) => state.student,
  );

  const [showRequestModel, setShowRequestModel] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  useEffect(() => {
    dispatch(fetchProject());
    dispatch(getSupervisor());
    dispatch(fetchAllSupervisor());
  }, [dispatch]);

  const hasSupervisor = useMemo(
    () => !!(supervisor && supervisor._id),
    [supervisor],
  );
  const hasProject = useMemo(() => !!(project && project._id), [project]);

  const formatDeadline = (dateStr) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";

    const day = date.getDate();
    const j = day % 10;
    const k = day % 100;

    let suffix = "th";
    if (j === 1 && k !== 11) suffix = "st";
    else if (j === 2 && k !== 12) suffix = "nd";
    else if (j === 3 && k !== 13) suffix = "rd";

    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    return `${day}${suffix} ${month} ${year}`;
  };

  const handleOpenRequest = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setShowRequestModel(true);
  };

  const submitRequest = () => {
    if (!selectedSupervisor) return;
    const message =
      requestMessage?.trim() ||
      `${authUser.name || "Student"} has request 
    ${selectedSupervisor.name} to be their supervisor.`;

    dispatch(requestSupervisor({ teacherId: selectedSupervisor._id, message }));
  };

  return (
    <>
      <div className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Current Supervisor</h1>
            {hasSupervisor && (
              <span className="badge badge-approve">Assigned</span>
            )}
          </div>
          {/* SUPERVISOR DETAILS  */}
          {hasSupervisor ? (
            <div className="space-y-6">
              <div className="flex items-start space-x-6">
                <img
                  src="https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?semt=ais_hybrid&w=740&q=80"
                  alt="supervisor_img"
                  className="w-20 h-20 rounded-all object-cover shadow-md"
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {supervisor?.name || "-"}
                    </h3>
                    <p className="text-lg text-slate-600">
                      {supervisor?.department || "-"}
                    </p>
                  </div>

                  <div className="grid grid-colos-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                        Experties
                      </label>
                      <p className="text-slate-800 font-medium">
                        {Array.isArray(supervisor?.experties)
                          ? supervisor.experties.join(", ")
                          : supervisor?.experties || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-slate-600 text-lg">
                Supervisor not assigned yet.
              </p>
            </div>
          )}
        </div>

        {/* PROJECT DETAILS - ONLY SHOW IF PROJECT EXISTS  */}
        {hasProject && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Project Details</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                      Project Title
                    </label>
                    <p className="text-lg font-semibold text-slate-800 mt-1">
                      {project?.title || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                      Status
                    </label>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full font-medium capitalize text-sm 
                          ${
                            project.status == "approved"
                              ? "bg-green-100 text-green-800"
                              : project.status == "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : project.status == "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                      >{project?.status || "Invalid"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SupervisorPage;
