import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddStudent from "../../components/modal/AddStudent";
import {
  createStudent,
  deleteStudent,
  getAllUsers,
  updateStudent,
} from "../../store/slices/adminSlice";
import toggleStudentModal from "../../store/slices/popupSlice";

import { CheckCircle, Plus, TriangleAlert, Users } from "lucide-react";

const ManageStudents = () => {
  const { users, projects } = useSelector((state) => state.admin);
  const { isCreateStudentModalOpen } = useSelector((state) => state.popup);

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  const students = useMemo(() => {
    const studentUsers = (users || []).filter(
      (u) => u.role?.toLowerCase() === "student",
    );

    return studentUsers.map((student) => {
      const studentProject = (projects || []).find(
        (p) => p.student?._id === student.id,
      );
      return {
        ...student,
        projectTitle: studentProject?.title || null,
        supervisor: studentProject?.supervisor || null,
        projectStatus: studentProject?.projectStatus || null,
      };
    });
  }, [users, projects]);

  const departments = useMemo(() => {
    const set = new Set(
      (students || []).map((s) => s.department).filter(Boolean),
    );
    return Array.from(set);
  }, [students]);

  console.log(departments,"dept");
  

  const filterStudents = students.filter((student) => {
    const matchesSearch =
      (student.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterDepartment === "all" || student.department === filterDepartment;

    return matchesSearch && matchesFilter;
  });

  const handleCloseModel = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      name: "",
      email: "",
      department: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingStudent) {
      dispatch(updateStudent({ id: editingStudent._id, data: formData }));
    } else {
      dispatch(createStudent(formData));
    }
    handleCloseModel();
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      department: student.department,
    });
    setShowModal(true);
  };

  const handleDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      dispatch(deleteStudent(studentToDelete._id));
      setShowDeleteModal(false);
      setStudentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="card">
          <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-start">
            <div>
              <h1 className="card-title">Manage Students</h1>
              <p className="card-subtitle">
                Add, edit and manage students accounts
              </p>
            </div>

            <button
              onClick={() => dispatch(toggleStudentModal())}
              className="btn-primar flex items-center space-x-2 mt-4 md:mt-0"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Student</span>
            </button>
          </div>
        </div>

        {/* STATS CARDS  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">
                  Total Students
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  {students.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">
                  Completed Projects
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  {students.filter((s) => s.status === "completed").length}
                </p>
              </div>
            </div>
          </div>

          {/* Triangle Card Remaining  */}
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TriangleAlert className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">
                  Unassigned Projects
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  {students.filter((s) => !s.supervisor).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FILTER  */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Student
              </label>
              <input
                type="text"
                placeholder="Search by name or email..."
                className="input-field w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filter Status
              </label>
              <select
                className="input-field w-full"
                value={filterDepartment}
                onChange={(e) => e.target.value}
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option value={dept} key={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>


        {/* STUDENTS TABLE  */}
        <div className="card">
          <div className="card-header">
              <h2 className="card-title">Student List</h2>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Student Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Department & Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Supervisor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Project Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide"></th>
                    </tr>
                </thead>
              </table>
          </div>
        </div>

      </div>
    </>
  );
};

export default ManageStudents;
