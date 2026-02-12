-- Initialize database user and permissions
-- This script runs automatically when MySQL container starts

CREATE USER IF NOT EXISTS 'heronusa'@'%' IDENTIFIED BY 'dbheronusa45A';
GRANT ALL PRIVILEGES ON u469241017_heronusa.* TO 'heronusa'@'%';
FLUSH PRIVILEGES;
