-- Update lab table to include all necessary fields
ALTER TABLE `lab` 
ADD COLUMN `deskripsi` TEXT NULL,
ADD COLUMN `jadwal` VARCHAR(255) NULL,
ADD COLUMN `dosen` VARCHAR(255) NULL,
ADD COLUMN `kapasitas` INT NOT NULL DEFAULT 30,
ADD COLUMN `status` VARCHAR(50) NOT NULL DEFAULT 'aktif',
ADD COLUMN `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- Insert default labs
INSERT INTO `lab` (`nama_lab`, `deskripsi`, `jadwal`, `dosen`, `kapasitas`, `status`) VALUES
('LEA', 'Laboratorium Enterprise Application (LEA) mendalami pengembangan sistem enterprise berbasis Java, Spring, dan ERP.', 'Senin & Rabu - 08:00 s/d 12:00', 'Adi Arga Arifnur, M.Kom', 30, 'aktif'),
('LABGIS', 'Laboratorium Geographic Information System (GIS) fokus pada pengolahan data spasial, pemetaan digital, dan pemanfaatan teknologi geospasial.', 'Selasa & Kamis - 10:00 s/d 14:00', 'Prof. Surya Afnarius, Ph.D', 25, 'aktif'),
('LBI', 'Laboratorium Business Intelligence menyediakan sarana belajar data warehouse, analitik, dan big data tools seperti Tableau & Power BI.', 'Senin - Jumat - 09:00 s/d 16:00', 'Aina Hubby Aziira, M.Eng', 35, 'aktif'),
('LDKOM', 'Laboratorium Dasar Komputasi (LDKOM) fokus pada pembelajaran logika algoritma, UI/UX design, dan pembuatan prototipe interaktif.', 'Rabu & Jumat - 13:00 s/d 17:00', 'Jefril Rahmadoni, M.Kom', 28, 'aktif');

-- Insert default praktikum for each lab
INSERT INTO `praktikum` (`nama_praktikum`, `kode_masuk`, `lab_id`) VALUES
('Praktikum LEA', 'lea2024', 1),
('Praktikum LABGIS', 'labgis2024', 2),
('Praktikum LBI', 'lbi2024', 3),
('Praktikum LDKOM', 'ldkom2024', 4); 