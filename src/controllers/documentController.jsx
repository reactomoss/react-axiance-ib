import { v4 as uuidGenerator } from 'uuid';
import { documentAPI } from '../api';
import { errorHelper } from '../helpers';

async function upload(user, file, twoSided, fileBack, documentGroup, documentType) {
  const s3data = {};
  const formData = {};
  const uuid = {};

  formData.front = new FormData();
  uuid.front = uuidGenerator();
  if (!documentType) {
    throw new errorHelper.CodeError('Please select what type of document you would like to upload', 400);
  } else if (file == null) {
    throw new errorHelper.CodeError('You have not selected a file', 400);
  } else if (file.size > 4194304) {
    throw new errorHelper.CodeError(`${file.name} is too large, maximum allowed file size is 4MB`, 413);
  } else if (twoSided && fileBack == null) {
    throw new errorHelper.CodeError('Please add the back side of the document', 400);
  } else if (twoSided && fileBack.size > 4194304) {
    throw new errorHelper.CodeError(`${fileBack.name} is too large, maximum allowed file size is 4MB`, 413);
  }

  formData.front.append('file', file);
  formData.front.append('accountUuid', user.uuid);

  if (twoSided) {
    formData.back = new FormData();
    formData.back.append('file', fileBack);
    formData.back.append('accountUuid', user.uuid);
  }

  try {
    s3data.front = await documentAPI.s3Upload(formData.front);
    if (twoSided) {
      s3data.back = await documentAPI.s3Upload(formData.back);
    }
  } catch (error) {
    throw new errorHelper.CodeError('We encountered an error, please try again later.', 500);
  }

  try {
    await documentAPI.upload(user, uuid.front, s3data.front, file, documentGroup, documentType);
    if (twoSided) {
      uuid.back = uuidGenerator();
      await documentAPI.upload(user, uuid.back, s3data.back, fileBack, documentGroup, documentType.replace('FRONT', 'BACK'));
    }
  } catch (error) {
    throw new errorHelper.CodeError('We encountered an error, please try again later.', error.status);
  }
}

async function getDocuments(accountId) {
  let uploadDocuments;

  try {
    uploadDocuments = await documentAPI.getDocuments(accountId);
  } catch (error) {
    throw new errorHelper.CodeError('We encountered an error, please try again later.', error.status);
  }

  return uploadDocuments;
}

export default { upload, getDocuments };
