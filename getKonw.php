<?php
$id = $_GET["id"];
if (!intval($id)) {
	return;
}
$Data = new mysqli("Your MySQL Host", "Username", "Password", "weather");
$sql = 'select * from knowledge where id = '.$id;
$Data -> query("set names UTF8");
$resultSet = $Data -> query($sql);
$row = $resultSet -> fetch_assoc();
if ($row) {
	$data = array('status'=>'OK','content'=>$row);
	echo json_encode($data);
} else {
   $data = array('status'=>'error');
   echo json_encode($data);
}
?>