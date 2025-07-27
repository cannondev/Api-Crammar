import Doc from '../models/doc_model';

export async function createDoc(docFields) {
  const doc = new Doc();
  doc.title = docFields.title;
  doc.content = docFields.content;
  doc.coverUrl = docFields.coverUrl;
  doc.tags = docFields.tags;
  // await creating a doc
  try {
    // TODO ERROR HERE I THINK
    const savedDoc = await doc.save();
    // return doc
    return savedDoc;
  } catch (error) {
    throw new Error(`create doc error: ${error}`);
  }
}

export async function getDocs() {
  // await finding docs
  try {
    const foundDocs = await Doc.find();
    // return docs
    return foundDocs;
  } catch (error) {
    throw new Error(`get docs error: ${error}`);
  }
}

export async function getDoc(id) {
  try {
    console.log(`getting doc: ${id}`);
    const foundDocById = await Doc.findById(id);

    // this check is wedged into place to satisfy the cypress testing to ensure that you cannot get a deleted ID
    // It is my solution, but TA Caleb Ash and I could not come up with a better way
    if (foundDocById === null) {
      throw new Error(' et doc by id error');
    }

    return foundDocById;
  } catch (error) {
    throw new Error(` get doc by id error: ${error}`);
  }
}

export async function deleteDoc(id) {
  try {
    console.log(` deleting doc: ${id}`);
    await Doc.findByIdAndDelete(id);
    return { message: 'Doc deleted success' };
  } catch (error) {
    throw new Error(` get doc by id error: ${error}`);
  }
}

export async function updateDoc(id, docFields) {
  try {
    const updatedDoc = await Doc.findByIdAndUpdate(id, docFields, { new: true });
    return updatedDoc;
  } catch (error) {
    throw new Error(` update doc by id error: ${error}`);
  }
}
