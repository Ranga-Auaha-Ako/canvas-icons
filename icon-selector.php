<?php

error_reporting(0);
$returnUrl = $_POST['launch_presentation_return_url'];

?>
<html>
	<head>
		<script src="/javascript/jquery-1.7.2.min.js"></script>
		<script>
		var divId="#previewIconDiv";
		var imgSlideDown=0;
		var returnUrl = '<?php echo $returnUrl;?>';
		function updateField( event ) {
			//update the field value
			var target = $( event.target );
			console.log( target );
			var tmpFieldValue = target.first().attr('src');
			let tmpAr = tmpFieldValue.split( "/" );
			
			console.log( { tmpFieldValue });
			try {
				let tmpAlt = tmpAr[ tmpAr.length -1 ].split('.')[0];
				location.href = returnUrl + "?embed_type=image_url&url="+tmpFieldValue + "&alt="+tmpAlt +"&width=48&height=48" ;
			}catch(e){
				location.href = returnUrl + "?embed_type=image_url&url="+tmpFieldValue + "&width=48&height=48&alt=%20";
			}
		}
		jQuery('document').ready( function(){
				jQuery('.icon').on( "click", updateField );
			}
		);
		</script>
<style>
.icon {
display:inline;
float:left;
padding: 10px;
font-size:x-small;
text-align: center;
cursor: pointer;
}
</style>
	</head>
	<body>
<div class="container">
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_activity1.png"  alt="activity"  title="activity" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_activity2.png"   alt="activity"  title="activity" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_activity3.png"   alt="activity"  title="activity" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_alert1.png" alt="alert"  title="alert"  title="alert" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_alert2.png" alt="alert"  title="alert" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_alert3.png" alt="alert"  title="alert" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_analyse1.png" alt="analyse"  title="analyse" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_analyse2.png" alt="analyse"  title="analyse" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_analyse3.png" alt="analyse"  title="analyse" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_analyse4.png" alt="analyse"  title="analyse" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_answer1.png" alt="answer" title="answer" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_article1.png" alt="article" title="article" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_assessment1.png" alt="assessment" title="assessment" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_assignment1.png" alt="assessment" title="assessment" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_assignment2.png" alt="assessment" title="assessment" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_assignment3.png" alt="assessment" title="assessment" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_audio1.png" alt="audio"  title="audio" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_audio2.png" alt="audio"  title="audio" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_audio3.png" alt="audio"  title="audio" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_audio4.png" alt="audio"  title="audio" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_audio5.png" alt="audio"  title="audio" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_audio6.png" alt="audio"  title="audio" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_audio7.png" alt="audio"  title="audio" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_audio8.png" alt="audio"  title="audio" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_case_study1.png" alt="case study"  title="case study" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_case_study2.png" alt="case study"  title="case study" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_cd_dvd1.png" alt="dvd" title="dvd" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_cd_dvd2.png" alt="dvd" title="dvd" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_discussion1.png" alt="discussion"  title="discussion" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_discussion2.png" alt="discussion"  title="discussion" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_discussion3.png" alt="discussion"  title="discussion" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_discussion4.png" alt="discussion"  title="discussion" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_discussion5.png" alt="discussion"  title="discussion" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_group1.png" alt="group" title="group" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_group2.png" alt="group" title="group" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_journal1.png" alt="journal"  title="journal" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_journal2.png" alt="journal"  title="journal" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_mobile1.png" alt="mobile"  title="mobile"  title="mobile"  /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_mobile2.png" alt="mobile"  title="mobile" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_note1.png" alt="note"  title="note" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_note2.png" alt="note"  title="note" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_note3.png" alt="note"  title="note" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_note4.png" alt="note"  title="note" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_objectives1.png" alt="objectives"  title="objectives" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_objectives2.png" alt="objectives"  title="objectives" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_partner1.png" alt="partner"  title="partner"/></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_point_to_ponder1.png" alt="point to ponder" title="point to ponder" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_portfolio1.png" alt="portfolio"   title="portfolio"/></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_practical1.png" alt="practical"  title="practical" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_practical2.png" alt="practical"  title="practical" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_practical3.png" alt="practical"  title="practical" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_preknowledge1.png" alt="preknowledge" title="preknowledge" title="preknowledge" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_preknowledge2.png" alt="preknowledge" title="preknowledge" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_preknowledge3.png" alt="preknowledge" title="preknowledge" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_preknowledge4.png" alt="preknowledge" title="preknowledge" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_preknowledge5.png" alt="preknowledge" title="preknowledge" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_print1.png" alt="print" title="print" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_question1.png" alt="question"  title="question" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_question2.png" alt="question"  title="question" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_reading1.png" alt="reading"  title="reading" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_reading2.png" alt="reading"  title="reading" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_resources1.png" alt="resources"  title="resources" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_resources2.png" alt="resources"  title="resources" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_resources3.png" alt="resources"  title="resources" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_resources4.png" alt="resources"  title="resources" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_self_test1.png" alt="self test"  title="self test" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_self_test2.png" alt="self test"  title="self test" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_self_test3.png" alt="self test"  title="self test" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_self_test4.png" alt="self test"  title="self test" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_summary1.png" alt="summary"  title="summary" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_summary2.png" alt="summary"  title="summary" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_summary3.png" alt="summary"  title="summary" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_to_share1.png" alt="to share"  title="to share" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_to_share2.png" alt="to share"  title="to share" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_to_share3.png" alt="to share"  title="to share" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_video1.png" alt="video"  alt="video" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_video2.png" alt="video"  alt="video" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_video3.png" alt="video"  alt="video" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_video4.png" alt="video"  alt="video" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_video5.png" alt="video"  alt="video" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_web_resources1.png" alt="web resources"  title="web resources" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_web_resources2.png" alt="web resources"  title="web resources" /></div>
	<div class="icon"><img src="https://flexiblelearning.auckland.ac.nz/icon-set/simple_web_resources3.png" alt="web resources"  title="web resources" /></div>
	<div class="icon"><img height="48" src="https://flexiblelearning.auckland.ac.nz/icon-set/checklist.png" alt="web checklist" /></div>
	<div class="icon"><img height="48" src="https://flexiblelearning.auckland.ac.nz/icon-set/checklist1.png" alt="web checklist" /></div>
	<div class="icon"><img height="48" src="https://flexiblelearning.auckland.ac.nz/icon-set/clock.png" alt="clock" title="clock" /></div>
	<div class="icon"><img height="48" src="https://flexiblelearning.auckland.ac.nz/icon-set/discussion.png" alt="discussion"  title="discussion" /></div>
	<div class="icon"><img height="48" src="https://flexiblelearning.auckland.ac.nz/icon-set/explore.png" alt="explore" title="explore"  /></div>
	<div class="icon"><img height="48" src="https://flexiblelearning.auckland.ac.nz/icon-set/folder.png" alt="folder" title="folder" /></div>
	<div class="icon"><img height="48" src="https://flexiblelearning.auckland.ac.nz/icon-set/group.png" alt="group" title="group" /></div>
</div>
	</body>
</html>