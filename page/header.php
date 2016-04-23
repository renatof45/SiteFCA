<?php
//print_r($_POST);
$dao=new utilizadorDAO();
$user=$dao->getUser($_SESSION['user']);
if (array_key_exists('area', $_POST))
   $_SESSION['area']=$_POST['area'];
//print_r ($user);
//echo json_encode($user)
//echo '<h3>'.$user['nome'].'</h3> <select><option value="'.$user['area'][0]['1'].'">'.$user['area'][0]['designacao'].'</option></select>';
?>

<h2 style="margin-top: 10px;margin-bottom: 15px;"><?php echo $user['nome']; ?> </h2>
<form id="ajaxform4" method="post">
<fieldset >
	<div class='field'>
		<label  style="margin-top: 2px; width: 150px;">Area de trabalho:</label>
		<select name="area" onchange="submit_area(this)">
	       <?php while (list($key, $val) = each($user['area'])): ?>
           <option value="<?php echo $key; ?>" <?php  if(array_key_exists('area', $_POST)) if($_POST['area']==$key) echo 'selected'; ?>>
      	     <?php echo $val; ?>
           </option>
           <?php endwhile; ?>
        </select>
	</div>
</fieldset>
</form>




