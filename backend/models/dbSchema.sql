-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
    PID INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-increment for Patient ID
    FName VARCHAR(50) NOT NULL,
    LName VARCHAR(50) NOT NULL,
    DOB DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    Phone_no VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    username VARCHAR(50) NOT NULL UNIQUE,  -- Added username column
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Department Table
CREATE TABLE IF NOT EXISTS department (
    Dept_ID INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-increment for Department ID
    Dept_name VARCHAR(100) NOT NULL
);

-- Doctor Table
CREATE TABLE IF NOT EXISTS doctor (
    DID INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-increment for Doctor ID
    Dname VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,  -- Added username column
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_no VARCHAR(15) NOT NULL,
    Dept_ID INT,
    FOREIGN KEY (Dept_ID) REFERENCES department(Dept_ID) ON DELETE SET NULL
);

-- Admins Table (Add username for login)
CREATE TABLE IF NOT EXISTS admins (
    Adm_ID INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-increment for Admin ID
    Admin_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,  -- Added username column
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_no VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    AppID INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-increment for Appointment ID
    Patient_ID INT,
    Doctor_ID INT,
    token_no INT NOT NULL,
    Date DATE NOT NULL,  -- Changed to DATE to only keep date without time
    Status ENUM('Pending', 'Approved', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Patient_ID) REFERENCES patients(PID) ON DELETE CASCADE,
    FOREIGN KEY (Doctor_ID) REFERENCES doctor(DID) ON DELETE CASCADE
);

-- Prescription Table
CREATE TABLE IF NOT EXISTS prescription (
    Pres_ID INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-increment for Prescription ID
    Patient_ID INT,
    Doctor_ID INT,
    diagnosis TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Keeps date and time of creation
    FOREIGN KEY (Patient_ID) REFERENCES patients(PID) ON DELETE CASCADE,
    FOREIGN KEY (Doctor_ID) REFERENCES doctor(DID) ON DELETE CASCADE
);

-- Medicine Table
CREATE TABLE IF NOT EXISTS medicine (
    Med_ID INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-increment for Medicine ID
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Prescription_Medicines Table
CREATE TABLE IF NOT EXISTS prescription_medicines (
    Pres_ID INT,
    Med_ID INT,
    PRIMARY KEY (Pres_ID, Med_ID),
    FOREIGN KEY (Pres_ID) REFERENCES prescription(Pres_ID) ON DELETE CASCADE,
    FOREIGN KEY (Med_ID) REFERENCES medicine(Med_ID) ON DELETE CASCADE
);

-- Bill Table
CREATE TABLE IF NOT EXISTS bill (
    BID INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-increment for Bill ID
    Pres_ID INT,
    tot_amnt DECIMAL(10, 2) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Pres_ID) REFERENCES prescription(Pres_ID) ON DELETE CASCADE
);
