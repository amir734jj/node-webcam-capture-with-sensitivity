module.exports = {
    getAllPhotos: function(db, callback) {
        db.serialize(function() {
            db.all("SELECT date, id, mimetype, mismatch FROM Album", function(err, rows) {
                if (!err) {
                    callback(rows);
                }
            });
        });
    },

    getPhotoById: function(db, id, callback) {
        db.serialize(function() {
            db.each("SELECT image FROM Album WHERE id = ?", id, function(err, row) {
                if (!err) {
                    callback(row.image);
                }
            });
        });
    },


    addPhoto: function(db, base64, date, mimetype, mismatch, callback) {
        db.serialize(function() {
            db.prepare("INSERT INTO Album (id, image, date, mimetype, mismatch) VALUES (NULL, ?, ?, ?, ?)").run([
                base64,
                date,
                mimetype,
                mismatch
            ], function(err) {
                if (!err) {
                    callback();
                }
            }).finalize();
        });
    },

    deleteAll: function(db, callback) {
        db.serialize(function() {
            db.run("DELETE FROM Album", function(err) {
                if (!err) {
                    callback();
                }
            });
        });
    }
};
