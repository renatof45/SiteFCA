TYPE=VIEW
query=select `sitefca`.`autorizacoes`.`ID` AS `ID`,`sitefca`.`autorizacoes`.`Numero` AS `Numero`,`sitefca`.`autorizacoes`.`Descricao do trabalho` AS `Descricao do trabalho`,`sitefca`.`firma`.`Nome` AS `Nome`,`sitefca`.`autorizacoes`.`Data fim` AS `Data fim` from (`sitefca`.`firma` join `sitefca`.`autorizacoes` on((`sitefca`.`firma`.`ID` = `sitefca`.`autorizacoes`.`Firma`)))
md5=c2d4c0925d26d25d26e6c3c830a537d4
updatable=1
algorithm=0
definer_user=root
definer_host=localhost
suid=1
with_check_option=0
timestamp=2016-04-08 07:31:53
create-version=1
source=select `sitefca`.`autorizacoes`.`ID` AS `ID`,`sitefca`.`autorizacoes`.`Numero` AS `Numero`,`sitefca`.`autorizacoes`.`Descricao do trabalho` AS `Descricao do trabalho`,`sitefca`.`firma`.`Nome` AS `Nome`,`sitefca`.`autorizacoes`.`Data fim` AS `Data fim` from (`sitefca`.`firma` join `sitefca`.`autorizacoes` on((`sitefca`.`firma`.`ID` = `sitefca`.`autorizacoes`.`Firma`)))
client_cs_name=utf8
connection_cl_name=utf8_general_ci
view_body_utf8=select `sitefca`.`autorizacoes`.`ID` AS `ID`,`sitefca`.`autorizacoes`.`Numero` AS `Numero`,`sitefca`.`autorizacoes`.`Descricao do trabalho` AS `Descricao do trabalho`,`sitefca`.`firma`.`Nome` AS `Nome`,`sitefca`.`autorizacoes`.`Data fim` AS `Data fim` from (`sitefca`.`firma` join `sitefca`.`autorizacoes` on((`sitefca`.`firma`.`ID` = `sitefca`.`autorizacoes`.`Firma`)))
