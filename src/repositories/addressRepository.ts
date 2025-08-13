import { Specification } from "@/lib/prisma/specification";
import Address from "@/types/address";
import ID from "@/types/id";
import { Address as PrismaAddress } from "@prisma/client";
import { BaseRepository } from "./baseRepository";

class AddressRepository extends BaseRepository<Address, PrismaAddress> {
  constructor() {
    super("address");
  }
}

const addressRepository = new AddressRepository();

export async function createAddress(address: Address): Promise<Address> {
  return addressRepository.create(address);
}

export async function getAddresss(
  specification?: Specification<Address>
): Promise<Address[]> {
  return addressRepository.getAll(specification);
}

export async function updateAddress(
  id: ID,
  data: Partial<Address>
): Promise<Address> {
  return addressRepository.update(id, data);
}

export async function deleteAddress(id: ID): Promise<void> {
  return addressRepository.delete(id);
}

export async function getAddress(id: ID): Promise<Address> {
  return addressRepository.getById(id);
}
