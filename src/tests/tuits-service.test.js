import {
  createTuit,
  deleteTuit, findTuitById, deleteTuitByText,deleteTuitByUserId,
  findAllTuits
} from "../services/tuits-service";
import {
  createUser,
  deleteUsersByUsername, findAllUsers,
  findUserById
} from "../services/users-service";

describe('createTuit', () => {

  // sample user to insert
  const user = {
    username: 'abc',
    password: 'ac',
    email: 'abc@berkeley.com'
  };

  // sample tuit to insert
  const tuit1 = {
    tuit: 'A thousand planets. One mission to save them all. Watch the new #Valerian trailer and like this Tweet to explore more. In theaters July 21',
    postedBy : ''
  };

  let user2 = "";

  // setup test before running test
  beforeAll(async() => {

    // remove any/all tuits to make sure we create it in the test
    user2 = await createUser(user);
    tuit1.postedBy = user2._id;
    return deleteTuitByUserId(tuit1.postedBy);

  })

  // clean up after test runs
  afterAll(() => {

    // remove any data we created
    deleteTuitByUserId(tuit1.postedBy);
    return deleteUsersByUsername(user.username);

  })

test('can create tuit with REST API', async () => {

  // insert new tuit in the database
    const newTuit = await createTuit(user2._id, tuit1);

  // verify inserted tuit's properties match parameter tuit
    expect(newTuit.tuit).toEqual(tuit1.tuit);
  });
});


describe('delete tuit ', () => {
    
  // sample user to delete
  const user = {
    username: 'thommas_sowell',
    password: 'compromise',
    email: 'compromise@solutions.com'
  };

  // sample tuit to insert
  const tuit = {
    tuit: 'Hey, what is up?',
    postedBy : ''
  };

  let user2 = '';
  let tuitt = '';
  
  // setup test before running test
  beforeAll(async() => {

    user2 = await createUser(user);
    tuit.postedBy = user2._id;
    tuitt = await createTuit(user2._id, tuit);

  })

  // clean up after test runs
  afterAll(() => {

    // remove any data we created
    deleteTuitByUserId(tuit.postedBy);
    return deleteUsersByUsername(user.username);

  })

  test('can delete tuit wtih REST API', async () => {
    // delete a tuit by its id. Assumes tuit already exists
    const status = await deleteTuit(tuitt._id);

    // verify we deleted at least one user by their username
    expect(status.deletedCount).toBeGreaterThanOrEqual(1);
});
});

describe('findTuitById', () => {
  // sample user we want to retrieve
  const user = {
    username: 'adam_smith',
    password: 'not0sum',
    email: 'wealth@nations.com'
  };

  // sample tuit to insert
  const tuit = {
    tuit: 'I love to dance',
    postedBy : ''
  };

  let user2 = '';
  let tuitt = '';
  
  // setup test before running test
  beforeAll(async() => {

    user2 = await createUser(user);
    tuit.postedBy = user2._id;
    tuitt = await createTuit(user2._id, tuit);

  })

  // clean up after test runs
  afterAll(() => {

    // remove any data we created
    deleteTuitByUserId(tuit.postedBy);
    return deleteUsersByUsername(user.username);

  })

  test('can retrieve a tuit by their primary key with REST API', async () => {
    // delete a tuit by its id. Assumes tuit already exists
    const status = await findTuitById(tuitt._id);

    // verify inserted tuit's properties match parameter tuit
    expect(status.tuit).toEqual(tuit.tuit);
});
});

describe('findAllTuits', () => {

  // sample user we want to retrieve
  const user = {
    username: 'adam_smith',
    password: 'not0sum',
    email: 'wealth@nations.com'
  };

  // sample tuits we'll insert to then retrieve
  const tuits = [
    "I like blue", "I'm going to chicago", "Enjoy your dinner"
  ];

  let user2 = '';
  
  // setup test before running test
  beforeAll(async() => {

    // remove any/all users to make sure we create it in the test
    user2 = await createUser(user);
    tuits.map(tuit =>
        createTuit(user2._id,
            {
                tuit: tuit,
                postedBy: user2._id,
            })
    )
  })

  // clean up after test runs
  afterAll(() => {

    // remove any data we created
    tuits.map(tuit =>
      deleteTuitByUserId(user2._id)
  )
    return deleteUsersByUsername(user.username);

  })

  test('can retrieve all tuits with REST API', async () => {
    // delete a tuit by its id. Assumes tuit already exists
    const status = await findAllTuits();

    // there should be a minimum number of tuits
    expect(status.length).toBeGreaterThanOrEqual(tuits.length);

    // let's check each tuit we inserted
    const tuitsWeInserted = status.filter(
      tuit => tuits.indexOf(tuit.tuit) >= 0);

   // compare the actual tuits in database with the ones we sent
    tuitsWeInserted.forEach(tuit => {
      const tuitName = tuits.find(tuitName => tuitName === tuit.tuit);
      expect(tuit.tuit).toEqual(tuitName);
});
});
})