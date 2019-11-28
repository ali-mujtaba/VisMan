# VisMan
An entry management web application

## How to set-up the application

 1. Install MySQL on your local machine
 2. Run MySQL client as 'root' user 
	 	 sudo sql -u root -p
 3. Create database with 'root' user
		 CREATE DATABASE visman
4. Create new user on MySQL with name 'visman'
		CREATE USER 'visman'@'localhost'
		IDENTIFIED BY 'abcd1234';
		GRANT ALL
		ON visman.*
		TO 'visman'@'localhost';
5. Restart MySQL client as user 'visman' with password 'abcd1234'
		mysql -u visman -p
6. Use 'visman' database
		USE visman;
7. Create a table for storing visitor and host details
		CREATE TABLE Entries(Reference_No INT(10) PRIMARY KEY
		AUTO_INCREMENT, VName VARCHAR(50), VEmail VARCHAR(50),
		VPhone BIGINT(10) UNSIGNED, VCheckInTime TIME, VCheckOutTime
		TIME, HName VARCHAR(50), HEmail VARCHAR(50), HPhone
		BIGINT(10), Entry_Time TIMESTAMP);
8.  Run app
		node app.js
9. Go to 'localhost:3000' on your browser

## Note

 - Ensure port 465 is allowed through your firewall for email through Gmail
 - Text can only be sent to my 2 numbers since they are only registered in my Nexmo trial account whitelist (you can input my contact number where you expect SMS or you can let me know to add your number to the whitelist)