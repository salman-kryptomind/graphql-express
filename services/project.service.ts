import { ProjectModel as projects } from "../models/Project";

class ProjectServiceClass {
  getProject = (id: string) => projects.findById(id);
  getAllProjects = () => projects.find();
  addProject = (project: any) => projects.create(project);
  deleteProject = (id: string) => projects.findByIdAndDelete(id);
  updateProject = (project: any) =>
    projects.findByIdAndUpdate(
      project.id,
      {
        $set: {
          name: project.name,
          description: project.description,
          status: project.status,
          clientId: project.clientId,
        },
      },
      { new: true }
    );
  deleteManyProjects = (id: string) => projects.deleteMany({ clientId: id });
}

export const ProjectService = new ProjectServiceClass();
