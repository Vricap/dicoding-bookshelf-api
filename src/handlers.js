const nanoid = require('nanoid');
const books = require('./books');

const simplifyBook = (data) => {
  const x = data.map((e) => {
    	return { id: e.id, name: e.name, publisher: e.publisher };
  });

  return x;
};

exports.readAllBooks = (req, h) => {
  try {
    // querying
    const { name, reading, finished } = req.query;
    if (name) {
      const filtBook = books.filter((e) => e.name.toLowerCase().includes(name.toLowerCase()));
      return h.response({ status: 'success', data: { books: simplifyBook(filtBook) } }).code(200);
    }

    if (Number(reading) === 1) {
    	const readingBook = books.filter((e) => e.reading === true);
    	return h.response({ status: 'success', data: { books: simplifyBook(readingBook) } }).code(200);
    } else if (Number(reading) === 0){
    	const noReadingBook = books.filter((e) => e.reading === false);
    	return h.response({ status: 'success', data: { books: simplifyBook(noReadingBook) } }).code(200);
    }

    if (Number(finished) === 1) {
   		const finishBook = books.filter((e) => e.finished === true);
   		return h.response({ status: 'success', data: { books: simplifyBook(finishBook) } }).code(200);
    } else if (Number(finished) === 0){
   		const noFinishBook = books.filter((e) => e.finished === false);
   		return h.response({ status: 'success', data: { books: simplifyBook(noFinishBook) } }).code(200);
    }

    return h.response({ status: 'success', data: { books: simplifyBook(books) } }).code(200);
  } catch (err) {
    return h.response({ status: 'fail', message: 'Gagal mendapatkan semua buku' }).code(400);
  }
};

exports.readBook = (req, h) => {
  try {
    const found	= books.find((e) => req.params.bookId === e.id);
    if (!found) throw new Error('Buku tidak ditemukan');
    return h.response({ status: 'success', data: { book: found } });
  } catch (err) {
    return h.response({ status: 'fail', message: err.message }).code(404);
  }
};

exports.writeBook = (req, h) => {
  try {
    const { name, readPage, pageCount } = req.payload;
    if (!name) throw new Error('Gagal menambahkan buku. Mohon isi nama buku');
    if (readPage > pageCount) throw new Error('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');

    const id = nanoid.nanoid();
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    books.push({
      ...req.payload,
      id,
      finished,
      insertedAt,
      updatedAt
    });

    // validasi
    const success = books.find((e) => e.id === id);
    if (!success) throw new Error('Buku gagal di masukan');

    return h.response({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: success.id } }).code(201);
  } catch (err) {
    return h.response({ status: 'fail', message: err.message }).code(400);
  }
};

exports.updateBook = (req, h) => {
  try {
    const { name, readPage, pageCount } = req.payload;
    if (!name) {
      throw new Error('Gagal memperbarui buku. Mohon isi nama buku');
    } else if (readPage > pageCount) {
      throw new Error('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');
    }

    let f = false;
    books.forEach((e, i) => {
      if (e.id === req.params.bookId) {
      	e.updatedAt = new Date().toISOString();
      	books[i] = { ...e, ...req.payload };
        f = true;
      }
    });
    if (!f) throw { message: 'Gagal memperbarui buku. Id tidak ditemukan', code: 404 };
    return h.response({ status: 'success', message: 'Buku berhasil diperbarui' }).code(200);
  } catch (err) {
    return h.response({ status: 'fail', message: err.message }).code(err.code || 400);
  }
};

exports.deleteBook = (req, h) => {
  try {
    let f = false;
    books.forEach((e, i) => {
      if (e.id === req.params.bookId) {
        books.splice(i, 1);
        f = true;
      }
    });
    if (!f) throw new Error('Buku gagal dihapus. Id tidak ditemukan');
    return h.response({ status: 'success', message: 'Buku berhasil dihapus' }).code(200);
  } catch (err) {
    return h.response({ status: 'fail', message: err.message }).code(404);
  }
};
