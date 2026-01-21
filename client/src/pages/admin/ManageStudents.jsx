import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddStudent from "../../components/modal/AddStudent";
import {
  createStudent,
  deleteStudent,
  getAllUsers,
  updateStudent,
} from "../../store/slices/adminSlice";
import { Plus } from "lucide-react";

const ManageStudents = () => {
  const { users, projects } = useSelector((state) => state.admin);
  const { isCreateStudentModalOpen } = useSelector(state.popup);

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

  useEffect(() => {
    dispatch(getAllUsers());
  });

  const departments = useMemo(() => {
    const set = new Set(students || [])
      .map((s) => s.department)
      .filter(Boolean);

    return Array.from(set);
  }, [students]);

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

            <button>
              <Plus/>
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default ManageStudents;
