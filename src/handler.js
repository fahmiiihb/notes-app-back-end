const { nanoid } = require('nanoid');
const notes = require('./notes.js');

const addNoteHandler = (request, h) => {
  const { tittle, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNotes = {
    tittle, tags, body, id, createdAt, updatedAt,
  };
  notes.push(newNotes);

  const isSuccess = notes.filter((a) => a.id === id).length > 0;

  if (isSuccess){
    const response = h.response({
      status : 'success',
      message : 'Catatan berhasil ditambahkan',
      data : {
        noteId : id,
      },

    });
    response.header('Access-Control-Allow-Origin', '*');
    response.code(201);
    return response;
  }

  if (!isSuccess){
    const response = h.response({
      status : 'fail',
      message : 'Catatan gagal ditambahkan'
    });
    response.code(500);
    return response;
  }
};

const getAllNotesHandler = () => ({
  status : 'success',
  data : {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.filter((note) => note.id === id)[0];
  if (note !== undefined){
    return {
      status : 'success',
      data : {
        note,
      }
    };
  }

  const response = h.response({
    status : 'fail',
    message : 'Catatan tidak ditemukan'
  });

  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((n) => n.id === id);

  if (index !== -1){
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt
    };
    const response = h.response({
      status : 'success',
      message : 'Catatan berhasil diubah',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status : 'fail',
    message : 'gagal memperbarui catatan, id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((n) => n.id === id);

  if (index !== -1){
    notes.splice(index, 1);
    const response = h.response({
      status : 'success',
      message : 'Berhasil menghapus catatan',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status : 'fail',
    message : 'catatan gagal dihapus, Id tidak ditemukan'
  });
  response.code(404);
  return response;
};


module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler,
  deleteNoteByIdHandler,
};