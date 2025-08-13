import { Specification } from "@/lib/prisma/specification";
import ContactInfo from "@/types/contactInfo";
import ID from "@/types/id";
import { ContactInfo as PrismaContactInfo } from "@prisma/client";
import { BaseRepository } from "./baseRepository";

class ContactInfoRepository extends BaseRepository<
  ContactInfo,
  PrismaContactInfo
> {
  constructor() {
    super("contactInfo");
  }
}

const contactInfoRepository = new ContactInfoRepository();

export async function createContactInfo(
  contactInfo: ContactInfo
): Promise<ContactInfo> {
  return contactInfoRepository.create(contactInfo);
}

export async function getContactInfos(
  specification?: Specification<ContactInfo>
): Promise<ContactInfo[]> {
  return contactInfoRepository.getAll(specification);
}

export async function updateContactInfo(
  id: ID,
  data: Partial<ContactInfo>
): Promise<ContactInfo> {
  return contactInfoRepository.update(id, data);
}

export async function deleteContactInfo(id: ID): Promise<void> {
  return contactInfoRepository.delete(id);
}

export async function getContactInfo(id: ID): Promise<ContactInfo> {
  return contactInfoRepository.getById(id);
}
