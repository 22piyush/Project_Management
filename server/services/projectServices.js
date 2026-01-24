import { Project } from "../models/project";

export const getProjectByStudent = async (studentId) => {
  return await Project.findOne({ student: studentId }).sort({ createdAt: -1 });
};

export const createProject = async (projectData) => {
  const project = new Project(projectData);
  await project.save();
  return project;
};

export const getProjectById = async (id) => {
  const project = await Project.findById(id)
  .populate("student", "name email")
  .populate("supervisor", "name email")
};
