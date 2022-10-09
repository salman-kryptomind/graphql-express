import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { ClientService } from "../services/client.service";
import { ProjectService } from "../services/project.service";

const ClientType = new GraphQLObjectType({
  name: "Client",
  description: "Represent a client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phone: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const ProjectType = new GraphQLObjectType({
  name: "Project",
  description: "Represents a project",
  fields: () => ({
    id: { type: GraphQLID },
    clientId: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    status: { type: new GraphQLNonNull(GraphQLString) },
    client: {
      type: ClientType,
      resolve: (parent, args) => {
        return ClientService.getClientById(parent.clientId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve: (_, args) => ClientService.getClientById(args.id),
    },
    clients: {
      type: new GraphQLList(ClientType),
      description: "List of clients",
      resolve: () => ClientService.getAllClients(),
    },
    project: {
      type: ProjectType,
      description: "A project",
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => ProjectService.getProject(args.id),
    },
    projects: {
      type: new GraphQLList(ProjectType),
      description: "List of project",
      resolve: () => ProjectService.getAllProjects(),
    },
  }),
});

const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addClient: {
      type: ClientType,
      description: "Add Client",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args) => ClientService.addClient(args),
    },
    deleteClient: {
      type: ClientType,
      description: "Delete Client",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, args) => {
        await ClientService.deleteClient(args.id);
        return ProjectService.deleteManyProjects(args.id);
      },
    },
    addProject: {
      type: ProjectType,
      description: "Add Project",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, args) => {
        return ProjectService.addProject(args);
      },
    },
    deleteProject: {
      type: ProjectType,
      description: "Delete Project",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, args) => ProjectService.deleteProject(args.id),
    },
    updateProject: {
      type: ProjectType,
      description: "Update Project",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatusUpdate",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
        },
      },
      resolve: (_, args) => ProjectService.updateProject(args),
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

export { schema };
