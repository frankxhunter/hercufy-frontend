// Datos de demostración: subconjunto de free-exercise-db (verificar licencia antes de publicar).
// Los nombres en español (nameEs) son de la capa de traducción simulada.
import { Exercise } from '../models';

export const EXERCISE_CATALOG: Exercise[] = [
 {
  "id": "Barbell_Bench_Press_-_Medium_Grip",
  "name": "Barbell Bench Press - Medium Grip",
  "nameEs": "Press banca con barra",
  "level": "beginner",
  "mechanic": "compound",
  "force": "push",
  "equipment": "barbell",
  "category": "strength",
  "primaryMuscles": [
   "chest"
  ],
  "secondaryMuscles": [
   "shoulders",
   "triceps"
  ],
  "instructions": [
   "Lie back on a flat bench. Using a medium width grip (a grip that creates a 90-degree angle in the middle of the movement between the forearms and the upper arms), lift the bar from the rack and hold it straight over you with your arms locked. This will be your starting position.",
   "From the starting position, breathe in and begin coming down slowly until the bar touches your middle chest.",
   "After a brief pause, push the bar back to the starting position as you breathe out. Focus on pushing the bar using your chest muscles. Lock your arms and squeeze your chest in the contracted position at the top of the motion, hold for a second and then start coming down slowly again. Tip: Ideally, lowering the weight should take about twice as long as raising it.",
   "Repeat the movement for the prescribed amount of repetitions.",
   "When you are done, place the bar back in the rack."
  ],
  "images": [
   "Barbell_Bench_Press_-_Medium_Grip/0.jpg",
   "Barbell_Bench_Press_-_Medium_Grip/1.jpg"
  ]
 },
 {
  "id": "Incline_Dumbbell_Press",
  "name": "Incline Dumbbell Press",
  "nameEs": "Press inclinado con mancuernas",
  "level": "beginner",
  "mechanic": "compound",
  "force": "push",
  "equipment": "dumbbell",
  "category": "strength",
  "primaryMuscles": [
   "chest"
  ],
  "secondaryMuscles": [
   "shoulders",
   "triceps"
  ],
  "instructions": [
   "Lie back on an incline bench with a dumbbell in each hand atop your thighs. The palms of your hands will be facing each other.",
   "Then, using your thighs to help push the dumbbells up, lift the dumbbells one at a time so that you can hold them at shoulder width.",
   "Once you have the dumbbells raised to shoulder width, rotate your wrists forward so that the palms of your hands are facing away from you. This will be your starting position.",
   "Be sure to keep full control of the dumbbells at all times. Then breathe out and push the dumbbells up with your chest.",
   "Lock your arms at the top, hold for a second, and then start slowly lowering the weight. Tip Ideally, lowering the weights should take about twice as long as raising them.",
   "Repeat the movement for the prescribed amount of repetitions.",
   "When you are done, place the dumbbells back on your thighs and then on the floor. This is the safest manner to release the dumbbells."
  ],
  "images": [
   "Incline_Dumbbell_Press/0.jpg",
   "Incline_Dumbbell_Press/1.jpg"
  ]
 },
 {
  "id": "Dumbbell_Flyes",
  "name": "Dumbbell Flyes",
  "nameEs": "Aperturas con mancuernas",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "push",
  "equipment": "dumbbell",
  "category": "strength",
  "primaryMuscles": [
   "chest"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Lie down on a flat bench with a dumbbell on each hand resting on top of your thighs. The palms of your hand will be facing each other.",
   "Then using your thighs to help raise the dumbbells, lift the dumbbells one at a time so you can hold them in front of you at shoulder width with the palms of your hands facing each other. Raise the dumbbells up like you're pressing them, but stop and hold just before you lock out. This will be your starting position.",
   "With a slight bend on your elbows in order to prevent stress at the biceps tendon, lower your arms out at both sides in a wide arc until you feel a stretch on your chest. Breathe in as you perform this portion of the movement. Tip: Keep in mind that throughout the movement, the arms should remain stationary; the movement should only occur at the shoulder joint.",
   "Return your arms back to the starting position as you squeeze your chest muscles and breathe out. Tip: Make sure to use the same arc of motion used to lower the weights.",
   "Hold for a second at the contracted position and repeat the movement for the prescribed amount of repetitions."
  ],
  "images": [
   "Dumbbell_Flyes/0.jpg",
   "Dumbbell_Flyes/1.jpg"
  ]
 },
 {
  "id": "Cable_Crossover",
  "name": "Cable Crossover",
  "nameEs": "Cruce de poleas",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "push",
  "equipment": "cable",
  "category": "strength",
  "primaryMuscles": [
   "chest"
  ],
  "secondaryMuscles": [
   "shoulders"
  ],
  "instructions": [
   "To get yourself into the starting position, place the pulleys on a high position (above your head), select the resistance to be used and hold the pulleys in each hand.",
   "Step forward in front of an imaginary straight line between both pulleys while pulling your arms together in front of you. Your torso should have a small forward bend from the waist. This will be your starting position.",
   "With a slight bend on your elbows in order to prevent stress at the biceps tendon, extend your arms to the side (straight out at both sides) in a wide arc until you feel a stretch on your chest. Breathe in as you perform this portion of the movement. Tip: Keep in mind that throughout the movement, the arms and torso should remain stationary; the movement should only occur at the shoulder joint.",
   "Return your arms back to the starting position as you breathe out. Make sure to use the same arc of motion used to lower the weights.",
   "Hold for a second at the starting position and repeat the movement for the prescribed amount of repetitions."
  ],
  "images": [
   "Cable_Crossover/0.jpg",
   "Cable_Crossover/1.jpg"
  ]
 },
 {
  "id": "Dips_-_Chest_Version",
  "name": "Dips - Chest Version",
  "nameEs": "Fondos para pecho",
  "level": "intermediate",
  "mechanic": "compound",
  "force": "push",
  "equipment": "other",
  "category": "strength",
  "primaryMuscles": [
   "chest"
  ],
  "secondaryMuscles": [
   "shoulders",
   "triceps"
  ],
  "instructions": [
   "For this exercise you will need access to parallel bars. To get yourself into the starting position, hold your body at arms length (arms locked) above the bars.",
   "While breathing in, lower yourself slowly with your torso leaning forward around 30 degrees or so and your elbows flared out slightly until you feel a slight stretch in the chest.",
   "Once you feel the stretch, use your chest to bring your body back to the starting position as you breathe out. Tip: Remember to squeeze the chest at the top of the movement for a second.",
   "Repeat the movement for the prescribed amount of repetitions."
  ],
  "images": [
   "Dips_-_Chest_Version/0.jpg",
   "Dips_-_Chest_Version/1.jpg"
  ]
 },
 {
  "id": "Barbell_Incline_Bench_Press_-_Medium_Grip",
  "name": "Barbell Incline Bench Press - Medium Grip",
  "nameEs": "Press inclinado con barra",
  "level": "beginner",
  "mechanic": "compound",
  "force": "push",
  "equipment": "barbell",
  "category": "strength",
  "primaryMuscles": [
   "chest"
  ],
  "secondaryMuscles": [
   "shoulders",
   "triceps"
  ],
  "instructions": [
   "Lie back on an incline bench. Using a medium-width grip (a grip that creates a 90-degree angle in the middle of the movement between the forearms and the upper arms), lift the bar from the rack and hold it straight over you with your arms locked. This will be your starting position.",
   "As you breathe in, come down slowly until you feel the bar on you upper chest.",
   "After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your chest muscles. Lock your arms in the contracted position, squeeze your chest, hold for a second and then start coming down slowly again. Tip: it should take at least twice as long to go down than to come up.",
   "Repeat the movement for the prescribed amount of repetitions.",
   "When you are done, place the bar back in the rack."
  ],
  "images": [
   "Barbell_Incline_Bench_Press_-_Medium_Grip/0.jpg",
   "Barbell_Incline_Bench_Press_-_Medium_Grip/1.jpg"
  ]
 },
 {
  "id": "Standing_Military_Press",
  "name": "Standing Military Press",
  "nameEs": "Press militar de pie",
  "level": "beginner",
  "mechanic": "compound",
  "force": "push",
  "equipment": "barbell",
  "category": "strength",
  "primaryMuscles": [
   "shoulders"
  ],
  "secondaryMuscles": [
   "triceps"
  ],
  "instructions": [
   "Start by placing a barbell that is about chest high on a squat rack. Once you have selected the weights, grab the barbell using a pronated (palms facing forward) grip. Make sure to grip the bar wider than shoulder width apart from each other.",
   "Slightly bend the knees and place the barbell on your collar bone. Lift the barbell up keeping it lying on your chest. Take a step back and position your feet shoulder width apart from each other.",
   "Once you pick up the barbell with the correct grip length, lift the bar up over your head by locking your arms. Hold at about shoulder level and slightly in front of your head. This is your starting position.",
   "Lower the bar down to the collarbone slowly as you inhale.",
   "Lift the bar back up to the starting position as you exhale.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Standing_Military_Press/0.jpg",
   "Standing_Military_Press/1.jpg"
  ]
 },
 {
  "id": "Side_Lateral_Raise",
  "name": "Side Lateral Raise",
  "nameEs": "Elevaciones laterales",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "push",
  "equipment": "dumbbell",
  "category": "strength",
  "primaryMuscles": [
   "shoulders"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Pick a couple of dumbbells and stand with a straight torso and the dumbbells by your side at arms length with the palms of the hand facing you. This will be your starting position.",
   "While maintaining the torso in a stationary position (no swinging), lift the dumbbells to your side with a slight bend on the elbow and the hands slightly tilted forward as if pouring water in a glass. Continue to go up until you arms are parallel to the floor. Exhale as you execute this movement and pause for a second at the top.",
   "Lower the dumbbells back down slowly to the starting position as you inhale.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Side_Lateral_Raise/0.jpg",
   "Side_Lateral_Raise/1.jpg"
  ]
 },
 {
  "id": "Seated_Dumbbell_Press",
  "name": "Seated Dumbbell Press",
  "nameEs": "Press de hombros sentado con mancuernas",
  "level": "beginner",
  "mechanic": "compound",
  "force": "push",
  "equipment": "dumbbell",
  "category": "strength",
  "primaryMuscles": [
   "shoulders"
  ],
  "secondaryMuscles": [
   "triceps"
  ],
  "instructions": [
   "Grab a couple of dumbbells and sit on a military press bench or a utility bench that has a back support on it as you place the dumbbells upright on top of your thighs.",
   "Clean the dumbbells up one at a time by using your thighs to bring the dumbbells up to shoulder height at each side.",
   "Rotate the wrists so that the palms of your hands are facing forward. This is your starting position.",
   "As you exhale, push the dumbbells up until they touch at the top.",
   "After a second pause, slowly come down back to the starting position as you inhale.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Seated_Dumbbell_Press/0.jpg",
   "Seated_Dumbbell_Press/1.jpg"
  ]
 },
 {
  "id": "Arnold_Dumbbell_Press",
  "name": "Arnold Dumbbell Press",
  "nameEs": "Press Arnold",
  "level": "intermediate",
  "mechanic": "compound",
  "force": "push",
  "equipment": "dumbbell",
  "category": "strength",
  "primaryMuscles": [
   "shoulders"
  ],
  "secondaryMuscles": [
   "triceps"
  ],
  "instructions": [
   "Sit on an exercise bench with back support and hold two dumbbells in front of you at about upper chest level with your palms facing your body and your elbows bent. Tip: Your arms should be next to your torso. The starting position should look like the contracted portion of a dumbbell curl.",
   "Now to perform the movement, raise the dumbbells as you rotate the palms of your hands until they are facing forward.",
   "Continue lifting the dumbbells until your arms are extended above you in straight arm position. Breathe out as you perform this portion of the movement.",
   "After a second pause at the top, begin to lower the dumbbells to the original position by rotating the palms of your hands towards you. Tip: The left arm will be rotated in a counter clockwise manner while the right one will be rotated clockwise. Breathe in as you perform this portion of the movement.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Arnold_Dumbbell_Press/0.jpg",
   "Arnold_Dumbbell_Press/1.jpg"
  ]
 },
 {
  "id": "Front_Dumbbell_Raise",
  "name": "Front Dumbbell Raise",
  "nameEs": "Elevaciones frontales con mancuernas",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "push",
  "equipment": "dumbbell",
  "category": "strength",
  "primaryMuscles": [
   "shoulders"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Pick a couple of dumbbells and stand with a straight torso and the dumbbells on front of your thighs at arms length with the palms of the hand facing your thighs. This will be your starting position.",
   "While maintaining the torso stationary (no swinging), lift the left dumbbell to the front with a slight bend on the elbow and the palms of the hands always facing down. Continue to go up until you arm is slightly above parallel to the floor. Exhale as you execute this portion of the movement and pause for a second at the top. Inhale after the second pause.",
   "Now lower the dumbbell back down slowly to the starting position as you simultaneously lift the right dumbbell.",
   "Continue alternating in this fashion until all of the recommended amount of repetitions have been performed for each arm."
  ],
  "images": [
   "Front_Dumbbell_Raise/0.jpg",
   "Front_Dumbbell_Raise/1.jpg"
  ]
 },
 {
  "id": "Triceps_Pushdown",
  "name": "Triceps Pushdown",
  "nameEs": "Extensión de tríceps en polea",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "push",
  "equipment": "cable",
  "category": "strength",
  "primaryMuscles": [
   "triceps"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Attach a straight or angled bar to a high pulley and grab with an overhand grip (palms facing down) at shoulder width.",
   "Standing upright with the torso straight and a very small inclination forward, bring the upper arms close to your body and perpendicular to the floor. The forearms should be pointing up towards the pulley as they hold the bar. This is your starting position.",
   "Using the triceps, bring the bar down until it touches the front of your thighs and the arms are fully extended perpendicular to the floor. The upper arms should always remain stationary next to your torso and only the forearms should move. Exhale as you perform this movement.",
   "After a second hold at the contracted position, bring the bar slowly up to the starting point. Breathe in as you perform this step.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Triceps_Pushdown/0.jpg",
   "Triceps_Pushdown/1.jpg"
  ]
 },
 {
  "id": "Triceps_Pushdown_-_Rope_Attachment",
  "name": "Triceps Pushdown - Rope Attachment",
  "nameEs": "Extensión de tríceps con cuerda",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "push",
  "equipment": "cable",
  "category": "strength",
  "primaryMuscles": [
   "triceps"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Attach a rope attachment to a high pulley and grab with a neutral grip (palms facing each other).",
   "Standing upright with the torso straight and a very small inclination forward, bring the upper arms close to your body and perpendicular to the floor. The forearms should be pointing up towards the pulley as they hold the rope with the palms facing each other. This is your starting position.",
   "Using the triceps, bring the rope down as you bring each side of the rope to the side of your thighs. At the end of the movement the arms are fully extended and perpendicular to the floor. The upper arms should always remain stationary next to your torso and only the forearms should move. Exhale as you perform this movement.",
   "After holding for a second, at the contracted position, bring the rope slowly up to the starting point. Breathe in as you perform this step.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Triceps_Pushdown_-_Rope_Attachment/0.jpg",
   "Triceps_Pushdown_-_Rope_Attachment/1.jpg"
  ]
 },
 {
  "id": "Dips_-_Triceps_Version",
  "name": "Dips - Triceps Version",
  "nameEs": "Fondos para tríceps",
  "level": "beginner",
  "mechanic": "compound",
  "force": "push",
  "equipment": "body only",
  "category": "strength",
  "primaryMuscles": [
   "triceps"
  ],
  "secondaryMuscles": [
   "chest",
   "shoulders"
  ],
  "instructions": [
   "To get into the starting position, hold your body at arm's length with your arms nearly locked above the bars.",
   "Now, inhale and slowly lower yourself downward. Your torso should remain upright and your elbows should stay close to your body. This helps to better focus on tricep involvement. Lower yourself until there is a 90 degree angle formed between the upper arm and forearm.",
   "Then, exhale and push your torso back up using your triceps to bring your body back to the starting position.",
   "Repeat the movement for the prescribed amount of repetitions."
  ],
  "images": [
   "Dips_-_Triceps_Version/0.jpg",
   "Dips_-_Triceps_Version/1.jpg"
  ]
 },
 {
  "id": "Lying_Triceps_Press",
  "name": "Lying Triceps Press",
  "nameEs": "Press francés tumbado",
  "level": "intermediate",
  "mechanic": "isolation",
  "force": "push",
  "equipment": "e-z curl bar",
  "category": "strength",
  "primaryMuscles": [
   "triceps"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Lie on a flat bench with either an e-z bar (my preference) or a straight bar placed on the floor behind your head and your feet on the floor.",
   "Grab the bar behind you, using a medium overhand (pronated) grip, and raise the bar in front of you at arms length. Tip: The arms should be perpendicular to the torso and the floor. The elbows should be tucked in. This is the starting position.",
   "As you breathe in, slowly lower the weight until the bar lightly touches your forehead while keeping the upper arms and elbows stationary.",
   "At that point, use the triceps to bring the weight back up to the starting position as you breathe out.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Lying_Triceps_Press/0.jpg",
   "Lying_Triceps_Press/1.jpg"
  ]
 },
 {
  "id": "Standing_Dumbbell_Triceps_Extension",
  "name": "Standing Dumbbell Triceps Extension",
  "nameEs": "Extensión de tríceps con mancuerna",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "push",
  "equipment": "dumbbell",
  "category": "strength",
  "primaryMuscles": [
   "triceps"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "To begin, stand up with a dumbbell held by both hands. Your feet should be about shoulder width apart from each other. Slowly use both hands to grab the dumbbell and lift it over your head until both arms are fully extended.",
   "The resistance should be resting in the palms of your hands with your thumbs around it. The palm of the hands should be facing up towards the ceiling. This will be your starting position.",
   "Keeping your upper arms close to your head with elbows in and perpendicular to the floor, lower the resistance in a semicircular motion behind your head until your forearms touch your biceps. Tip: The upper arms should remain stationary and only the forearms should move. Breathe in as you perform this step.",
   "Go back to the starting position by using the triceps to raise the dumbbell. Breathe out as you perform this step.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Standing_Dumbbell_Triceps_Extension/0.jpg",
   "Standing_Dumbbell_Triceps_Extension/1.jpg"
  ]
 },
 {
  "id": "Close-Grip_Barbell_Bench_Press",
  "name": "Close-Grip Barbell Bench Press",
  "nameEs": "Press banca agarre cerrado",
  "level": "beginner",
  "mechanic": "compound",
  "force": "push",
  "equipment": "barbell",
  "category": "strength",
  "primaryMuscles": [
   "triceps"
  ],
  "secondaryMuscles": [
   "chest",
   "shoulders"
  ],
  "instructions": [
   "Lie back on a flat bench. Using a close grip (around shoulder width), lift the bar from the rack and hold it straight over you with your arms locked. This will be your starting position.",
   "As you breathe in, come down slowly until you feel the bar on your middle chest. Tip: Make sure that - as opposed to a regular bench press - you keep the elbows close to the torso at all times in order to maximize triceps involvement.",
   "After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your triceps muscles. Lock your arms in the contracted position, hold for a second and then start coming down slowly again. Tip: It should take at least twice as long to go down than to come up.",
   "Repeat the movement for the prescribed amount of repetitions.",
   "When you are done, place the bar back in the rack."
  ],
  "images": [
   "Close-Grip_Barbell_Bench_Press/0.jpg",
   "Close-Grip_Barbell_Bench_Press/1.jpg"
  ]
 },
 {
  "id": "Pullups",
  "name": "Pullups",
  "nameEs": "Dominadas",
  "level": "beginner",
  "mechanic": "compound",
  "force": "pull",
  "equipment": "body only",
  "category": "strength",
  "primaryMuscles": [
   "lats"
  ],
  "secondaryMuscles": [
   "biceps",
   "middle back"
  ],
  "instructions": [
   "Grab the pull-up bar with the palms facing forward using the prescribed grip. Note on grips: For a wide grip, your hands need to be spaced out at a distance wider than your shoulder width. For a medium grip, your hands need to be spaced out at a distance equal to your shoulder width and for a close grip at a distance smaller than your shoulder width.",
   "As you have both arms extended in front of you holding the bar at the chosen grip width, bring your torso back around 30 degrees or so while creating a curvature on your lower back and sticking your chest out. This is your starting position.",
   "Pull your torso up until the bar touches your upper chest by drawing the shoulders and the upper arms down and back. Exhale as you perform this portion of the movement. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. The upper torso should remain stationary as it moves through space and only the arms should move. The forearms should do no other work other than hold the bar.",
   "After a second on the contracted position, start to inhale and slowly lower your torso back to the starting position when your arms are fully extended and the lats are fully stretched.",
   "Repeat this motion for the prescribed amount of repetitions."
  ],
  "images": [
   "Pullups/0.jpg",
   "Pullups/1.jpg"
  ]
 },
 {
  "id": "Chin-Up",
  "name": "Chin-Up",
  "nameEs": "Dominadas supinas",
  "level": "beginner",
  "mechanic": "compound",
  "force": "pull",
  "equipment": "body only",
  "category": "strength",
  "primaryMuscles": [
   "lats"
  ],
  "secondaryMuscles": [
   "biceps",
   "forearms",
   "middle back"
  ],
  "instructions": [
   "Grab the pull-up bar with the palms facing your torso and a grip closer than the shoulder width.",
   "As you have both arms extended in front of you holding the bar at the chosen grip width, keep your torso as straight as possible while creating a curvature on your lower back and sticking your chest out. This is your starting position. Tip: Keeping the torso as straight as possible maximizes biceps stimulation while minimizing back involvement.",
   "As you breathe out, pull your torso up until your head is around the level of the pull-up bar. Concentrate on using the biceps muscles in order to perform the movement. Keep the elbows close to your body. Tip: The upper torso should remain stationary as it moves through space and only the arms should move. The forearms should do no other work other than hold the bar.",
   "After a second of squeezing the biceps in the contracted position, slowly lower your torso back to the starting position; when your arms are fully extended. Breathe in as you perform this portion of the movement.",
   "Repeat this motion for the prescribed amount of repetitions."
  ],
  "images": [
   "Chin-Up/0.jpg",
   "Chin-Up/1.jpg"
  ]
 },
 {
  "id": "Wide-Grip_Lat_Pulldown",
  "name": "Wide-Grip Lat Pulldown",
  "nameEs": "Jalón al pecho agarre ancho",
  "level": "beginner",
  "mechanic": "compound",
  "force": "pull",
  "equipment": "cable",
  "category": "strength",
  "primaryMuscles": [
   "lats"
  ],
  "secondaryMuscles": [
   "biceps",
   "middle back",
   "shoulders"
  ],
  "instructions": [
   "Sit down on a pull-down machine with a wide bar attached to the top pulley. Make sure that you adjust the knee pad of the machine to fit your height. These pads will prevent your body from being raised by the resistance attached to the bar.",
   "Grab the bar with the palms facing forward using the prescribed grip. Note on grips: For a wide grip, your hands need to be spaced out at a distance wider than shoulder width. For a medium grip, your hands need to be spaced out at a distance equal to your shoulder width and for a close grip at a distance smaller than your shoulder width.",
   "As you have both arms extended in front of you holding the bar at the chosen grip width, bring your torso back around 30 degrees or so while creating a curvature on your lower back and sticking your chest out. This is your starting position.",
   "As you breathe out, bring the bar down until it touches your upper chest by drawing the shoulders and the upper arms down and back. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. The upper torso should remain stationary and only the arms should move. The forearms should do no other work except for holding the bar; therefore do not try to pull down the bar using the forearms.",
   "After a second at the contracted position squeezing your shoulder blades together, slowly raise the bar back to the starting position when your arms are fully extended and the lats are fully stretched. Inhale during this portion of the movement.",
   "Repeat this motion for the prescribed amount of repetitions."
  ],
  "images": [
   "Wide-Grip_Lat_Pulldown/0.jpg",
   "Wide-Grip_Lat_Pulldown/1.jpg"
  ]
 },
 {
  "id": "Bent_Over_Barbell_Row",
  "name": "Bent Over Barbell Row",
  "nameEs": "Remo con barra inclinado",
  "level": "beginner",
  "mechanic": "compound",
  "force": "pull",
  "equipment": "barbell",
  "category": "strength",
  "primaryMuscles": [
   "middle back"
  ],
  "secondaryMuscles": [
   "biceps",
   "lats",
   "shoulders"
  ],
  "instructions": [
   "Holding a barbell with a pronated grip (palms facing down), bend your knees slightly and bring your torso forward, by bending at the waist, while keeping the back straight until it is almost parallel to the floor. Tip: Make sure that you keep the head up. The barbell should hang directly in front of you as your arms hang perpendicular to the floor and your torso. This is your starting position.",
   "Now, while keeping the torso stationary, breathe out and lift the barbell to you. Keep the elbows close to the body and only use the forearms to hold the weight. At the top contracted position, squeeze the back muscles and hold for a brief pause.",
   "Then inhale and slowly lower the barbell back to the starting position.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Bent_Over_Barbell_Row/0.jpg",
   "Bent_Over_Barbell_Row/1.jpg"
  ]
 },
 {
  "id": "One-Arm_Dumbbell_Row",
  "name": "One-Arm Dumbbell Row",
  "nameEs": "Remo con mancuerna a una mano",
  "level": "beginner",
  "mechanic": "compound",
  "force": "pull",
  "equipment": "dumbbell",
  "category": "strength",
  "primaryMuscles": [
   "middle back"
  ],
  "secondaryMuscles": [
   "biceps",
   "lats",
   "shoulders"
  ],
  "instructions": [
   "Choose a flat bench and place a dumbbell on each side of it.",
   "Place the right leg on top of the end of the bench, bend your torso forward from the waist until your upper body is parallel to the floor, and place your right hand on the other end of the bench for support.",
   "Use the left hand to pick up the dumbbell on the floor and hold the weight while keeping your lower back straight. The palm of the hand should be facing your torso. This will be your starting position.",
   "Pull the resistance straight up to the side of your chest, keeping your upper arm close to your side and keeping the torso stationary. Breathe out as you perform this step. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. Also, make sure that the force is performed with the back muscles and not the arms. Finally, the upper torso should remain stationary and only the arms should move. The forearms should do no other work except for holding the dumbbell; therefore do not try to pull the dumbbell up using the forearms.",
   "Lower the resistance straight down to the starting position. Breathe in as you perform this step.",
   "Repeat the movement for the specified amount of repetitions.",
   "Switch sides and repeat again with the other arm."
  ],
  "images": [
   "One-Arm_Dumbbell_Row/0.jpg",
   "One-Arm_Dumbbell_Row/1.jpg"
  ]
 },
 {
  "id": "Seated_Cable_Rows",
  "name": "Seated Cable Rows",
  "nameEs": "Remo sentado en polea",
  "level": "beginner",
  "mechanic": "compound",
  "force": "pull",
  "equipment": "cable",
  "category": "strength",
  "primaryMuscles": [
   "middle back"
  ],
  "secondaryMuscles": [
   "biceps",
   "lats",
   "shoulders"
  ],
  "instructions": [
   "For this exercise you will need access to a low pulley row machine with a V-bar. Note: The V-bar will enable you to have a neutral grip where the palms of your hands face each other. To get into the starting position, first sit down on the machine and place your feet on the front platform or crossbar provided making sure that your knees are slightly bent and not locked.",
   "Lean over as you keep the natural alignment of your back and grab the V-bar handles.",
   "With your arms extended pull back until your torso is at a 90-degree angle from your legs. Your back should be slightly arched and your chest should be sticking out. You should be feeling a nice stretch on your lats as you hold the bar in front of you. This is the starting position of the exercise.",
   "Keeping the torso stationary, pull the handles back towards your torso while keeping the arms close to it until you touch the abdominals. Breathe out as you perform that movement. At that point you should be squeezing your back muscles hard. Hold that contraction for a second and slowly go back to the original position while breathing in.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Seated_Cable_Rows/0.jpg",
   "Seated_Cable_Rows/1.jpg"
  ]
 },
 {
  "id": "Barbell_Deadlift",
  "name": "Barbell Deadlift",
  "nameEs": "Peso muerto",
  "level": "intermediate",
  "mechanic": "compound",
  "force": "pull",
  "equipment": "barbell",
  "category": "strength",
  "primaryMuscles": [
   "lower back"
  ],
  "secondaryMuscles": [
   "calves",
   "forearms",
   "glutes",
   "hamstrings",
   "lats",
   "middle back",
   "quadriceps",
   "traps"
  ],
  "instructions": [
   "Stand in front of a loaded barbell.",
   "While keeping the back as straight as possible, bend your knees, bend forward and grasp the bar using a medium (shoulder width) overhand grip. This will be the starting position of the exercise. Tip: If it is difficult to hold on to the bar with this grip, alternate your grip or use wrist straps.",
   "While holding the bar, start the lift by pushing with your legs while simultaneously getting your torso to the upright position as you breathe out. In the upright position, stick your chest out and contract the back by bringing the shoulder blades back. Think of how the soldiers in the military look when they are in standing in attention.",
   "Go back to the starting position by bending at the knees while simultaneously leaning the torso forward at the waist while keeping the back straight. When the weights on the bar touch the floor you are back at the starting position and ready to perform another repetition.",
   "Perform the amount of repetitions prescribed in the program."
  ],
  "images": [
   "Barbell_Deadlift/0.jpg",
   "Barbell_Deadlift/1.jpg"
  ]
 },
 {
  "id": "Barbell_Curl",
  "name": "Barbell Curl",
  "nameEs": "Curl con barra",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "pull",
  "equipment": "barbell",
  "category": "strength",
  "primaryMuscles": [
   "biceps"
  ],
  "secondaryMuscles": [
   "forearms"
  ],
  "instructions": [
   "Stand up with your torso upright while holding a barbell at a shoulder-width grip. The palm of your hands should be facing forward and the elbows should be close to the torso. This will be your starting position.",
   "While holding the upper arms stationary, curl the weights forward while contracting the biceps as you breathe out. Tip: Only the forearms should move.",
   "Continue the movement until your biceps are fully contracted and the bar is at shoulder level. Hold the contracted position for a second and squeeze the biceps hard.",
   "Slowly begin to bring the bar back to starting position as your breathe in.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Barbell_Curl/0.jpg",
   "Barbell_Curl/1.jpg"
  ]
 },
 {
  "id": "Dumbbell_Bicep_Curl",
  "name": "Dumbbell Bicep Curl",
  "nameEs": "Curl de bíceps con mancuernas",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "pull",
  "equipment": "dumbbell",
  "category": "strength",
  "primaryMuscles": [
   "biceps"
  ],
  "secondaryMuscles": [
   "forearms"
  ],
  "instructions": [
   "Stand up straight with a dumbbell in each hand at arm's length. Keep your elbows close to your torso and rotate the palms of your hands until they are facing forward. This will be your starting position.",
   "Now, keeping the upper arms stationary, exhale and curl the weights while contracting your biceps. Continue to raise the weights until your biceps are fully contracted and the dumbbells are at shoulder level. Hold the contracted position for a brief pause as you squeeze your biceps.",
   "Then, inhale and slowly begin to lower the dumbbells back to the starting position.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Dumbbell_Bicep_Curl/0.jpg",
   "Dumbbell_Bicep_Curl/1.jpg"
  ]
 },
 {
  "id": "Hammer_Curls",
  "name": "Hammer Curls",
  "nameEs": "Curl martillo",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "pull",
  "equipment": "dumbbell",
  "category": "strength",
  "primaryMuscles": [
   "biceps"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Stand up with your torso upright and a dumbbell on each hand being held at arms length. The elbows should be close to the torso.",
   "The palms of the hands should be facing your torso. This will be your starting position.",
   "Now, while holding your upper arm stationary, exhale and curl the weight forward while contracting the biceps. Continue to raise the weight until the biceps are fully contracted and the dumbbell is at shoulder level. Hold the contracted position for a brief moment as you squeeze the biceps. Tip: Focus on keeping the elbow stationary and only moving your forearm.",
   "After the brief pause, inhale and slowly begin the lower the dumbbells back down to the starting position.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Hammer_Curls/0.jpg",
   "Hammer_Curls/1.jpg"
  ]
 },
 {
  "id": "Preacher_Curl",
  "name": "Preacher Curl",
  "nameEs": "Curl predicador",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "pull",
  "equipment": "barbell",
  "category": "strength",
  "primaryMuscles": [
   "biceps"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "To perform this movement you will need a preacher bench and an E-Z bar. Grab the E-Z curl bar at the close inner handle (either have someone hand you the bar which is preferable or grab the bar from the front bar rest provided by most preacher benches). The palm of your hands should be facing forward and they should be slightly tilted inwards due to the shape of the bar.",
   "With the upper arms positioned against the preacher bench pad and the chest against it, hold the E-Z Curl Bar at shoulder length. This will be your starting position.",
   "As you breathe in, slowly lower the bar until your upper arm is extended and the biceps is fully stretched.",
   "As you exhale, use the biceps to curl the weight up until your biceps is fully contracted and the bar is at shoulder height. Squeeze the biceps hard and hold this position for a second.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Preacher_Curl/0.jpg",
   "Preacher_Curl/1.jpg"
  ]
 },
 {
  "id": "Barbell_Full_Squat",
  "name": "Barbell Full Squat",
  "nameEs": "Sentadilla con barra",
  "level": "intermediate",
  "mechanic": "compound",
  "force": "push",
  "equipment": "barbell",
  "category": "strength",
  "primaryMuscles": [
   "quadriceps"
  ],
  "secondaryMuscles": [
   "calves",
   "glutes",
   "hamstrings",
   "lower back"
  ],
  "instructions": [
   "This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack just above shoulder level. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it.",
   "Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso.",
   "Step away from the rack and position your legs using a shoulder-width medium stance with the toes slightly pointed out. Keep your head up at all times and maintain a straight back. This will be your starting position.",
   "Begin to slowly lower the bar by bending the knees and sitting back with your hips as you maintain a straight posture with the head up. Continue down until your hamstrings are on your calves. Inhale as you perform this portion of the movement.",
   "Begin to raise the bar as you exhale by pushing the floor with the heel or middle of your foot as you straighten the legs and extend the hips to go back to the starting position.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Barbell_Full_Squat/0.jpg",
   "Barbell_Full_Squat/1.jpg"
  ]
 },
 {
  "id": "Leg_Press",
  "name": "Leg Press",
  "nameEs": "Prensa de piernas",
  "level": "beginner",
  "mechanic": "compound",
  "force": "push",
  "equipment": "machine",
  "category": "strength",
  "primaryMuscles": [
   "quadriceps"
  ],
  "secondaryMuscles": [
   "calves",
   "glutes",
   "hamstrings"
  ],
  "instructions": [
   "Using a leg press machine, sit down on the machine and place your legs on the platform directly in front of you at a medium (shoulder width) foot stance. (Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances described in the foot positioning section).",
   "Lower the safety bars holding the weighted platform in place and press the platform all the way up until your legs are fully extended in front of you. Tip: Make sure that you do not lock your knees. Your torso and the legs should make a perfect 90-degree angle. This will be your starting position.",
   "As you inhale, slowly lower the platform until your upper and lower legs make a 90-degree angle.",
   "Pushing mainly with the heels of your feet and using the quadriceps go back to the starting position as you exhale.",
   "Repeat for the recommended amount of repetitions and ensure to lock the safety pins properly once you are done. You do not want that platform falling on you fully loaded."
  ],
  "images": [
   "Leg_Press/0.jpg",
   "Leg_Press/1.jpg"
  ]
 },
 {
  "id": "Romanian_Deadlift",
  "name": "Romanian Deadlift",
  "nameEs": "Peso muerto rumano",
  "level": "intermediate",
  "mechanic": "compound",
  "force": "pull",
  "equipment": "barbell",
  "category": "strength",
  "primaryMuscles": [
   "hamstrings"
  ],
  "secondaryMuscles": [
   "calves",
   "glutes",
   "lower back"
  ],
  "instructions": [
   "Put a barbell in front of you on the ground and grab it using a pronated (palms facing down) grip that a little wider than shoulder width. Tip: Depending on the weight used, you may need wrist wraps to perform the exercise and also a raised platform in order to allow for better range of motion.",
   "Bend the knees slightly and keep the shins vertical, hips back and back straight. This will be your starting position.",
   "Keeping your back and arms completely straight at all times, use your hips to lift the bar as you exhale. Tip: The movement should not be fast but steady and under control.",
   "Once you are standing completely straight up, lower the bar by pushing the hips back, only slightly bending the knees, unlike when squatting. Tip: Take a deep breath at the start of the movement and keep your chest up. Hold your breath as you lower and exhale as you complete the movement.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Romanian_Deadlift/0.jpg",
   "Romanian_Deadlift/1.jpg"
  ]
 },
 {
  "id": "Leg_Extensions",
  "name": "Leg Extensions",
  "nameEs": "Extensión de cuádriceps",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "push",
  "equipment": "machine",
  "category": "strength",
  "primaryMuscles": [
   "quadriceps"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "For this exercise you will need to use a leg extension machine. First choose your weight and sit on the machine with your legs under the pad (feet pointed forward) and the hands holding the side bars. This will be your starting position. Tip: You will need to adjust the pad so that it falls on top of your lower leg (just above your feet). Also, make sure that your legs form a 90-degree angle between the lower and upper leg. If the angle is less than 90-degrees then that means the knee is over the toes which in turn creates undue stress at the knee joint. If the machine is designed that way, either look for another machine or just make sure that when you start executing the exercise you stop going down once you hit the 90-degree angle.",
   "Using your quadriceps, extend your legs to the maximum as you exhale. Ensure that the rest of the body remains stationary on the seat. Pause a second on the contracted position.",
   "Slowly lower the weight back to the original position as you inhale, ensuring that you do not go past the 90-degree angle limit.",
   "Repeat for the recommended amount of times."
  ],
  "images": [
   "Leg_Extensions/0.jpg",
   "Leg_Extensions/1.jpg"
  ]
 },
 {
  "id": "Seated_Leg_Curl",
  "name": "Seated Leg Curl",
  "nameEs": "Curl femoral sentado",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "pull",
  "equipment": "machine",
  "category": "strength",
  "primaryMuscles": [
   "hamstrings"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Adjust the machine lever to fit your height and sit on the machine with your back against the back support pad.",
   "Place the back of lower leg on top of padded lever (just a few inches under the calves) and secure the lap pad against your thighs, just above the knees. Then grasp the side handles on the machine as you point your toes straight (or you can also use any of the other two stances) and ensure that the legs are fully straight right in front of you. This will be your starting position.",
   "As you exhale, pull the machine lever as far as possible to the back of your thighs by flexing at the knees. Keep your torso stationary at all times. Hold the contracted position for a second.",
   "Slowly return to the starting position as you breathe in.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Seated_Leg_Curl/0.jpg",
   "Seated_Leg_Curl/1.jpg"
  ]
 },
 {
  "id": "Lying_Leg_Curls",
  "name": "Lying Leg Curls",
  "nameEs": "Curl femoral tumbado",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "pull",
  "equipment": "machine",
  "category": "strength",
  "primaryMuscles": [
   "hamstrings"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Adjust the machine lever to fit your height and lie face down on the leg curl machine with the pad of the lever on the back of your legs (just a few inches under the calves). Tip: Preferably use a leg curl machine that is angled as opposed to flat since an angled position is more favorable for hamstrings recruitment.",
   "Keeping the torso flat on the bench, ensure your legs are fully stretched and grab the side handles of the machine. Position your toes straight (or you can also use any of the other two stances described on the foot positioning section). This will be your starting position.",
   "As you exhale, curl your legs up as far as possible without lifting the upper legs from the pad. Once you hit the fully contracted position, hold it for a second.",
   "As you inhale, bring the legs back to the initial position. Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Lying_Leg_Curls/0.jpg",
   "Lying_Leg_Curls/1.jpg"
  ]
 },
 {
  "id": "Standing_Calf_Raises",
  "name": "Standing Calf Raises",
  "nameEs": "Elevación de talones de pie",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "push",
  "equipment": "machine",
  "category": "strength",
  "primaryMuscles": [
   "calves"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Adjust the padded lever of the calf raise machine to fit your height.",
   "Place your shoulders under the pads provided and position your toes facing forward (or using any of the two other positions described at the beginning of the chapter). The balls of your feet should be secured on top of the calf block with the heels extending off it. Push the lever up by extending your hips and knees until your torso is standing erect. The knees should be kept with a slight bend; never locked. Toes should be facing forward, outwards or inwards as described at the beginning of the chapter. This will be your starting position.",
   "Raise your heels as you breathe out by extending your ankles as high as possible and flexing your calf. Ensure that the knee is kept stationary at all times. There should be no bending at any time. Hold the contracted position by a second before you start to go back down.",
   "Go back slowly to the starting position as you breathe in by lowering your heels as you bend the ankles until calves are stretched.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Standing_Calf_Raises/0.jpg",
   "Standing_Calf_Raises/1.jpg"
  ]
 },
 {
  "id": "Seated_Calf_Raise",
  "name": "Seated Calf Raise",
  "nameEs": "Elevación de talones sentado",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "push",
  "equipment": "machine",
  "category": "strength",
  "primaryMuscles": [
   "calves"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Sit on the machine and place your toes on the lower portion of the platform provided with the heels extending off. Choose the toe positioning of your choice (forward, in, or out) as per the beginning of this chapter.",
   "Place your lower thighs under the lever pad, which will need to be adjusted according to the height of your thighs. Now place your hands on top of the lever pad in order to prevent it from slipping forward.",
   "Lift the lever slightly by pushing your heels up and release the safety bar. This will be your starting position.",
   "Slowly lower your heels by bending at the ankles until the calves are fully stretched. Inhale as you perform this movement.",
   "Raise the heels by extending the ankles as high as possible as you contract the calves and breathe out. Hold the top contraction for a second.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Seated_Calf_Raise/0.jpg",
   "Seated_Calf_Raise/1.jpg"
  ]
 },
 {
  "id": "Barbell_Hip_Thrust",
  "name": "Barbell Hip Thrust",
  "nameEs": "Hip thrust con barra",
  "level": "intermediate",
  "mechanic": "compound",
  "force": "push",
  "equipment": "barbell",
  "category": "powerlifting",
  "primaryMuscles": [
   "glutes"
  ],
  "secondaryMuscles": [
   "calves",
   "hamstrings"
  ],
  "instructions": [
   "Begin seated on the ground with a bench directly behind you. Have a loaded barbell over your legs. Using a fat bar or having a pad on the bar can greatly reduce the discomfort caused by this exercise.",
   "Roll the bar so that it is directly above your hips, and lean back against the bench so that your shoulder blades are near the top of it.",
   "Begin the movement by driving through your feet, extending your hips vertically through the bar. Your weight should be supported by your shoulder blades and your feet. Extend as far as possible, then reverse the motion to return to the starting position."
  ],
  "images": [
   "Barbell_Hip_Thrust/0.jpg",
   "Barbell_Hip_Thrust/1.jpg"
  ]
 },
 {
  "id": "Dumbbell_Lunges",
  "name": "Dumbbell Lunges",
  "nameEs": "Zancadas con mancuernas",
  "level": "beginner",
  "mechanic": "compound",
  "force": "push",
  "equipment": "dumbbell",
  "category": "strength",
  "primaryMuscles": [
   "quadriceps"
  ],
  "secondaryMuscles": [
   "calves",
   "glutes",
   "hamstrings"
  ],
  "instructions": [
   "Stand with your torso upright holding two dumbbells in your hands by your sides. This will be your starting position.",
   "Step forward with your right leg around 2 feet or so from the foot being left stationary behind and lower your upper body down, while keeping the torso upright and maintaining balance. Inhale as you go down. Note: As in the other exercises, do not allow your knee to go forward beyond your toes as you come down, as this will put undue stress on the knee joint. Make sure that you keep your front shin perpendicular to the ground.",
   "Using mainly the heel of your foot, push up and go back to the starting position as you exhale.",
   "Repeat the movement for the recommended amount of repetitions and then perform with the left leg."
  ],
  "images": [
   "Dumbbell_Lunges/0.jpg",
   "Dumbbell_Lunges/1.jpg"
  ]
 },
 {
  "id": "Plank",
  "name": "Plank",
  "nameEs": "Plancha",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "static",
  "equipment": "body only",
  "category": "strength",
  "primaryMuscles": [
   "abdominals"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Get into a prone position on the floor, supporting your weight on your toes and your forearms. Your arms are bent and directly below the shoulder.",
   "Keep your body straight at all times, and hold this position as long as possible. To increase difficulty, an arm or leg can be raised."
  ],
  "images": [
   "Plank/0.jpg",
   "Plank/1.jpg"
  ]
 },
 {
  "id": "Crunches",
  "name": "Crunches",
  "nameEs": "Abdominales crunch",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "pull",
  "equipment": "body only",
  "category": "strength",
  "primaryMuscles": [
   "abdominals"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Lie flat on your back with your feet flat on the ground, or resting on a bench with your knees bent at a 90 degree angle. If you are resting your feet on a bench, place them three to four inches apart and point your toes inward so they touch.",
   "Now place your hands lightly on either side of your head keeping your elbows in. Tip: Don't lock your fingers behind your head.",
   "While pushing the small of your back down in the floor to better isolate your abdominal muscles, begin to roll your shoulders off the floor.",
   "Continue to push down as hard as you can with your lower back as you contract your abdominals and exhale. Your shoulders should come up off the floor only about four inches, and your lower back should remain on the floor. At the top of the movement, contract your abdominals hard and keep the contraction for a second. Tip: Focus on slow, controlled movement - don't cheat yourself by using momentum.",
   "After the one second contraction, begin to come down slowly again to the starting position as you inhale.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Crunches/0.jpg",
   "Crunches/1.jpg"
  ]
 },
 {
  "id": "Hanging_Leg_Raise",
  "name": "Hanging Leg Raise",
  "nameEs": "Elevación de piernas colgado",
  "level": "expert",
  "mechanic": "isolation",
  "force": "pull",
  "equipment": "body only",
  "category": "strength",
  "primaryMuscles": [
   "abdominals"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Hang from a chin-up bar with both arms extended at arms length in top of you using either a wide grip or a medium grip. The legs should be straight down with the pelvis rolled slightly backwards. This will be your starting position.",
   "Raise your legs until the torso makes a 90-degree angle with the legs. Exhale as you perform this movement and hold the contraction for a second or so.",
   "Go back slowly to the starting position as you breathe in.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Hanging_Leg_Raise/0.jpg",
   "Hanging_Leg_Raise/1.jpg"
  ]
 },
 {
  "id": "Face_Pull",
  "name": "Face Pull",
  "nameEs": "Face pull",
  "level": "intermediate",
  "mechanic": "compound",
  "force": "pull",
  "equipment": "cable",
  "category": "strength",
  "primaryMuscles": [
   "shoulders"
  ],
  "secondaryMuscles": [
   "middle back"
  ],
  "instructions": [
   "Facing a high pulley with a rope or dual handles attached, pull the weight directly towards your face, separating your hands as you do so. Keep your upper arms parallel to the ground."
  ],
  "images": [
   "Face_Pull/0.jpg",
   "Face_Pull/1.jpg"
  ]
 },
 {
  "id": "Reverse_Flyes",
  "name": "Reverse Flyes",
  "nameEs": "Aperturas invertidas",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "pull",
  "equipment": "dumbbell",
  "category": "strength",
  "primaryMuscles": [
   "shoulders"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "To begin, lie down on an incline bench with the chest and stomach pressing against the incline. Have the dumbbells in each hand with the palms facing each other (neutral grip).",
   "Extend the arms in front of you so that they are perpendicular to the angle of the bench. The legs should be stationary while applying pressure with the ball of your toes. This is the starting position.",
   "Maintaining the slight bend of the elbows, move the weights out and away from each other (to the side) in an arc motion while exhaling. Tip: Try to squeeze your shoulder blades together to get the best results from this exercise.",
   "The arms should be elevated until they are parallel to the floor.",
   "Feel the contraction and slowly lower the weights back down to the starting position while inhaling.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Reverse_Flyes/0.jpg",
   "Reverse_Flyes/1.jpg"
  ]
 },
 {
  "id": "Barbell_Shrug",
  "name": "Barbell Shrug",
  "nameEs": "Encogimientos con barra",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "pull",
  "equipment": "barbell",
  "category": "strength",
  "primaryMuscles": [
   "traps"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Stand up straight with your feet at shoulder width as you hold a barbell with both hands in front of you using a pronated grip (palms facing the thighs). Tip: Your hands should be a little wider than shoulder width apart. You can use wrist wraps for this exercise for a better grip. This will be your starting position.",
   "Raise your shoulders up as far as you can go as you breathe out and hold the contraction for a second. Tip: Refrain from trying to lift the barbell by using your biceps.",
   "Slowly return to the starting position as you breathe in.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Barbell_Shrug/0.jpg",
   "Barbell_Shrug/1.jpg"
  ]
 },
 {
  "id": "Dumbbell_Shrug",
  "name": "Dumbbell Shrug",
  "nameEs": "Encogimientos con mancuernas",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "pull",
  "equipment": "dumbbell",
  "category": "strength",
  "primaryMuscles": [
   "traps"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Stand erect with a dumbbell on each hand (palms facing your torso), arms extended on the sides.",
   "Lift the dumbbells by elevating the shoulders as high as possible while you exhale. Hold the contraction at the top for a second. Tip: The arms should remain extended at all times. Refrain from using the biceps to help lift the dumbbells. Only the shoulders should be moving up and down.",
   "Lower the dumbbells back to the original position.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Dumbbell_Shrug/0.jpg",
   "Dumbbell_Shrug/1.jpg"
  ]
 },
 {
  "id": "Butterfly",
  "name": "Butterfly",
  "nameEs": "Máquina de aperturas (mariposa)",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "pull",
  "equipment": "machine",
  "category": "strength",
  "primaryMuscles": [
   "chest"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Sit on the machine with your back flat on the pad.",
   "Take hold of the handles. Tip: Your upper arms should be positioned parallel to the floor; adjust the machine accordingly. This will be your starting position.",
   "Push the handles together slowly as you squeeze your chest in the middle. Breathe out during this part of the motion and hold the contraction for a second.",
   "Return back to the starting position slowly as you inhale until your chest muscles are fully stretched.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Butterfly/0.jpg",
   "Butterfly/1.jpg"
  ]
 },
 {
  "id": "Bodyweight_Squat",
  "name": "Bodyweight Squat",
  "nameEs": "Sentadilla con peso corporal",
  "level": "beginner",
  "mechanic": "compound",
  "force": "push",
  "equipment": "body only",
  "category": "strength",
  "primaryMuscles": [
   "quadriceps"
  ],
  "secondaryMuscles": [
   "glutes",
   "hamstrings"
  ],
  "instructions": [
   "Stand with your feet shoulder width apart. You can place your hands behind your head. This will be your starting position.",
   "Begin the movement by flexing your knees and hips, sitting back with your hips.",
   "Continue down to full depth if you are able,and quickly reverse the motion until you return to the starting position. As you squat, keep your head and chest up and push your knees out."
  ],
  "images": [
   "Bodyweight_Squat/0.jpg",
   "Bodyweight_Squat/1.jpg"
  ]
 },
 {
  "id": "Goblet_Squat",
  "name": "Goblet Squat",
  "nameEs": "Sentadilla goblet",
  "level": "beginner",
  "mechanic": "compound",
  "force": "push",
  "equipment": "kettlebells",
  "category": "strength",
  "primaryMuscles": [
   "quadriceps"
  ],
  "secondaryMuscles": [
   "calves",
   "glutes",
   "hamstrings",
   "shoulders"
  ],
  "instructions": [
   "Stand holding a light kettlebell by the horns close to your chest. This will be your starting position.",
   "Squat down between your legs until your hamstrings are on your calves. Keep your chest and head up and your back straight.",
   "At the bottom position, pause and use your elbows to push your knees out. Return to the starting position, and repeat for 10-20 repetitions."
  ],
  "images": [
   "Goblet_Squat/0.jpg",
   "Goblet_Squat/1.jpg"
  ]
 },
 {
  "id": "Cable_Crunch",
  "name": "Cable Crunch",
  "nameEs": "Crunch en polea",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "pull",
  "equipment": "cable",
  "category": "strength",
  "primaryMuscles": [
   "abdominals"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Kneel below a high pulley that contains a rope attachment.",
   "Grasp cable rope attachment and lower the rope until your hands are placed next to your face.",
   "Flex your hips slightly and allow the weight to hyperextend the lower back. This will be your starting position.",
   "With the hips stationary, flex the waist as you contract the abs so that the elbows travel towards the middle of the thighs. Exhale as you perform this portion of the movement and hold the contraction for a second.",
   "Slowly return to the starting position as you inhale. Tip: Make sure that you keep constant tension on the abs throughout the movement. Also, do not choose a weight so heavy that the lower back handles the brunt of the work.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Cable_Crunch/0.jpg",
   "Cable_Crunch/1.jpg"
  ]
 },
 {
  "id": "Machine_Shoulder_Military_Press",
  "name": "Machine Shoulder (Military) Press",
  "nameEs": "Press de hombros en máquina",
  "level": "beginner",
  "mechanic": "compound",
  "force": "push",
  "equipment": "machine",
  "category": "strength",
  "primaryMuscles": [
   "shoulders"
  ],
  "secondaryMuscles": [
   "triceps"
  ],
  "instructions": [
   "Sit down on the Shoulder Press Machine and select the weight.",
   "Grab the handles to your sides as you keep the elbows bent and in line with your torso. This will be your starting position.",
   "Now lift the handles as you exhale and you extend the arms fully. At the top of the position make sure that you hold the contraction for a second.",
   "Lower the handles slowly back to the starting position as you inhale.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Machine_Shoulder_Military_Press/0.jpg",
   "Machine_Shoulder_Military_Press/1.jpg"
  ]
 },
 {
  "id": "Leverage_Chest_Press",
  "name": "Leverage Chest Press",
  "nameEs": "Press de pecho en máquina",
  "level": "beginner",
  "mechanic": "compound",
  "force": "push",
  "equipment": "machine",
  "category": "strength",
  "primaryMuscles": [
   "chest"
  ],
  "secondaryMuscles": [
   "shoulders",
   "triceps"
  ],
  "instructions": [
   "Load an appropriate weight onto the pins and adjust the seat for your height. The handles should be near the bottom or middle of the pectorals at the beginning of the motion.",
   "Your chest and head should be up and your shoulder blades retracted. This will be your starting position.",
   "Press the handles forward by extending through the elbow.",
   "After a brief pause at the top, return the weight just above the start position, keeping tension on the muscles by not returning the weight to the stops until the set is complete."
  ],
  "images": [
   "Leverage_Chest_Press/0.jpg",
   "Leverage_Chest_Press/1.jpg"
  ]
 },
 {
  "id": "Smith_Machine_Squat",
  "name": "Smith Machine Squat",
  "nameEs": "Sentadilla en multipower",
  "level": "beginner",
  "mechanic": "compound",
  "force": "push",
  "equipment": "machine",
  "category": "strength",
  "primaryMuscles": [
   "quadriceps"
  ],
  "secondaryMuscles": [
   "calves",
   "glutes",
   "hamstrings",
   "lower back"
  ],
  "instructions": [
   "To begin, first set the bar on the height that best matches your height. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it.",
   "Hold on to the bar using both arms at each side (palms facing forward), unlock it and lift it off the rack by first pushing with your legs and at the same time straightening your torso.",
   "Position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head up at all times and also maintain a straight back. This will be your starting position. (Note: For the purposes of this discussion we will use the medium stance which targets overall development; however you can choose any of the three stances discussed in the foot stances section).",
   "Begin to slowly lower the bar by bending the knees as you maintain a straight posture with the head up. Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees (which is the point in which the upper legs are below parallel to the floor). Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.",
   "Begin to raise the bar as you exhale by pushing the floor with the heel of your foot as you straighten the legs again and go back to the starting position.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Smith_Machine_Squat/0.jpg",
   "Smith_Machine_Squat/1.jpg"
  ]
 },
 {
  "id": "Hack_Squat",
  "name": "Hack Squat",
  "nameEs": "Sentadilla hack",
  "level": "beginner",
  "mechanic": "compound",
  "force": "push",
  "equipment": "machine",
  "category": "strength",
  "primaryMuscles": [
   "quadriceps"
  ],
  "secondaryMuscles": [
   "calves",
   "glutes",
   "hamstrings"
  ],
  "instructions": [
   "Place the back of your torso against the back pad of the machine and hook your shoulders under the shoulder pads provided.",
   "Position your legs in the platform using a shoulder width medium stance with the toes slightly pointed out. Tip: Keep your head up at all times and also maintain the back on the pad at all times.",
   "Place your arms on the side handles of the machine and disengage the safety bars (which on most designs is done by moving the side handles from a facing front position to a diagonal position).",
   "Now straighten your legs without locking the knees. This will be your starting position. (Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances described in the foot positioning section).",
   "Begin to slowly lower the unit by bending the knees as you maintain a straight posture with the head up (back on the pad at all times). Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees (which is the point in which the upper legs are below parallel to the floor). Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.",
   "Begin to raise the unit as you exhale by pushing the floor with mainly with the heel of your foot as you straighten the legs again and go back to the starting position.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Hack_Squat/0.jpg",
   "Hack_Squat/1.jpg"
  ]
 },
 {
  "id": "Barbell_Rear_Delt_Row",
  "name": "Barbell Rear Delt Row",
  "nameEs": "Remo para deltoides posterior",
  "level": "beginner",
  "mechanic": "compound",
  "force": "pull",
  "equipment": "barbell",
  "category": "strength",
  "primaryMuscles": [
   "shoulders"
  ],
  "secondaryMuscles": [
   "biceps",
   "lats",
   "middle back"
  ],
  "instructions": [
   "Stand up straight while holding a barbell using a wide (higher than shoulder width) and overhand (palms facing your body) grip.",
   "Bend knees slightly and bend over as you keep the natural arch of your back. Let the arms hang in front of you as they hold the bar. Once your torso is parallel to the floor, flare the elbows out and away from your body. Tip: Your torso and your arms should resemble the letter \"T\". Now you are ready to begin the exercise.",
   "While keeping the upper arms perpendicular to the torso, pull the barbell up towards your upper chest as you squeeze the rear delts and you breathe out. Tip: When performed correctly, this exercise should resemble a bench press in reverse. Also, refrain from using your biceps to do the work. Focus on targeting the rear delts; the arms should only act as hooks.",
   "Slowly go back to the initial position as you breathe in.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Barbell_Rear_Delt_Row/0.jpg",
   "Barbell_Rear_Delt_Row/1.jpg"
  ]
 },
 {
  "id": "Cable_Seated_Crunch",
  "name": "Cable Seated Crunch",
  "nameEs": "Crunch sentado en polea",
  "level": "beginner",
  "mechanic": "isolation",
  "force": "pull",
  "equipment": "cable",
  "category": "strength",
  "primaryMuscles": [
   "abdominals"
  ],
  "secondaryMuscles": [],
  "instructions": [
   "Seat on a flat bench with your back facing a high pulley.",
   "Grasp the cable rope attachment with both hands (with the palms of the hands facing each other) and place your hands securely over both shoulders. Tip: Allow the weight to hyperextend the lower back slightly. This will be your starting position.",
   "With the hips stationary, flex the waist so the elbows travel toward the hips. Breathe out as you perform this step.",
   "As you inhale, go back to the initial position slowly.",
   "Repeat for the recommended amount of repetitions."
  ],
  "images": [
   "Cable_Seated_Crunch/0.jpg",
   "Cable_Seated_Crunch/1.jpg"
  ]
 }
];
