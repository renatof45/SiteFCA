TYPE=VIEW
query=select `galp`.`autorizacoes`.`ID` AS `ID`,`galp`.`autorizacoes`.`Numero` AS `Numero`,`galp`.`autorizacoes`.`Descricao do trabalho` AS `Descricao do trabalho`,`galp`.`firma`.`Nome` AS `Nome`,`galp`.`autorizacoes`.`Data fim` AS `Data fim` from (`galp`.`firma` join `galp`.`autorizacoes` on((`galp`.`firma`.`ID` = `galp`.`autorizacoes`.`Firma`)))
md5=b35821a1e817e68f5662a9d54c2633eb
updatable=1
algorithm=0
definer_user=root
definer_host=localhost
suid=1
with_check_option=0
timestamp=2014-03-15 17:49:06
create-version=1
source=select `galp`.`autorizacoes`.`ID` AS `ID`,`galp`.`autorizacoes`.`Numero` AS `Numero`,`galp`.`autorizacoes`.`Descricao do trabalho` AS `Descricao do trabalho`,`galp`.`firma`.`Nome` AS `Nome`,`galp`.`autorizacoes`.`Data fim` AS `Data fim` from (`galp`.`firma` join `galp`.`autorizacoes` on((`galp`.`firma`.`ID` = `galp`.`autorizacoes`.`Firma`)))
client_cs_name=utf8
connection_cl_name=utf8_general_ci
view_body_utf8=select `galp`.`autorizacoes`.`ID` AS `ID`,`galp`.`autorizacoes`.`Numero` AS `Numero`,`galp`.`autorizacoes`.`Descricao do trabalho` AS `Descricao do trabalho`,`galp`.`firma`.`Nome` AS `Nome`,`galp`.`autorizacoes`.`Data fim` AS `Data fim` from (`galp`.`firma` join `galp`.`autorizacoes` on((`galp`.`firma`.`ID` = `galp`.`autorizacoes`.`Firma`)))
