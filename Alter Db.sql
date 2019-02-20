CREATE TABLE `user` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(100) default NULL,
  `password` varchar(100) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




ALTER TABLE `sites_visit`.`domains`     
ADD COLUMN `category` VARCHAR(300) NULL AFTER `url`;



ALTER TABLE `sites_visit`.`pages_posts`     
ADD COLUMN `category` VARCHAR(300) NULL AFTER `url`;


ALTER TABLE `sites_visit`.`domains`     
ADD COLUMN `notes` TEXT NULL AFTER `last_visited`;


ALTER TABLE `sites_visit`.`pages_posts`     
CHANGE `summary` `notes` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL ;



























