import { ClientModel as clients } from "../models/Client";

class ClientServiceClass {
  getClientById = (id: string) => clients.findById(id);
  getAllClients = () => clients.find();
  addClient = (c: any) => {
    const client = new clients({
      name: c.name,
      email: c.email,
      phone: c.phone,
    });

    return client.save();
  };
  deleteClient = (id: string) => clients.findByIdAndDelete(id);
}

export const ClientService = new ClientServiceClass();
