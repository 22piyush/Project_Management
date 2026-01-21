import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddStudent from "../../components/modal/AddStudent";

const ManageStudents = () => {
  const {users, projects} = useSelector((state) => state.admin);
  const { isCreateStudentModalOpen } = useSelector(state.popup);

  const [showModal, setShowModal] = useState(false); 

  return <></>;
};

export default ManageStudents;
