import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddTeacher from "../../components/modal/AddTeacher";
import {
  createTeacher,
  deleteTeacher,
  getAllUsers,
  updateTeacher,
} from "../../store/slices/adminSlice";

const ManageTeachers = () => {


    const { users } = useSelector((state) => state.admin);
    const { isCreateTeacherModalOpen } = useSelector((state) => state.popup);
    const [showModal, setShowModal] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDepartment, setFilterDepartment] = useState("all");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);
  
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      department: "",
      experties:"",
      maxStudents: 10,
    });
  
    const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(getAllUsers());
    }, []);
  
    const teachers = useMemo(() => {
      (users || []).filter((u) => u.role?.toLowerCase() === "teacher",);
    }, [users]);
  
    const departments = useMemo(() => {
      const set = new Set(
        (teachers || []).map((t) => t.department).filter(Boolean),
      );
      return Array.from(set);
    }, [teachers]);
  
    console.log(departments, "dept");
  
    const filterTeachers = teachers.filter((student) => {
      const matchesSearch =
        (teacher.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.email || "").toLowerCase().includes(searchTerm.toLowerCase());
  
      const matchesFilter =
        filterDepartment === "all" || teacher.department === filterDepartment;
  
      return matchesSearch && matchesFilter;
    });

    const handleCloseModel = () => {
      setShowModal(false);
      setEditingTeacher(null);
      setFormData({
        name: "",
        email: "",
        department: "",
        experties: "",
        maxStudents: 10,
      });
    };

      const handleSubmit = (e) => {
        e.preventDefault();
    
        if (editingTeacher) {
          dispatch(updateTeacher({ id: editingTeacher._id, data: formData }));
        }
        handleCloseModel();
      };
    
      const handleEdit = (teacher) => {
        setEditingTeacher(teacher);
        setFormData({
          name: teacher.name,
          email: teacher.email,
          department: teacher.department,
          experties: Array.isArray(teacher.experties) ? teacher.experties[0] : [teacher.experties || []],
          maxStudents: typeof teacher.maxStudents == "number" ? teacher.maxStudents : 10 ,
        });
        setShowModal(true);
      };
    
      const handleDelete = (teacher) => {
        setTeacherToDelete(teacher);
        setShowDeleteModal(true);
      };
    
      const confirmDelete = () => {
        if (teacherToDelete) {
          dispatch(deleteTeacher(teacherToDelete._id));
          setShowDeleteModal(false);
          setTeacherToDelete(null);
        }
      };
    
      const cancelDelete = () => {
        setShowDeleteModal(false);
        setTeacherToDelete(null);
      };
    


  return <></>;
};

export default ManageTeachers;
