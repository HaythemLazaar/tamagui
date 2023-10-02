import { faker } from '@faker-js/faker'
import { add } from 'date-fns'
import {
  AuthResponse,
  SupabaseClient,
  createClient,
} from '@supabase/supabase-js'
import { Database } from './types'
import { Enums, Tables } from './helpers'

type Climbs = Tables<'climbs'>
type ProfileClimbs = Tables<'profile_climbs'>
type Profiles = Tables<'profiles'>

const supabaseInstance = createClient<Database>(
  'http://localhost:54331',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
)
async function createClimbs(
  supabase: SupabaseClient<Database>,
  users: AuthResponse['data'][],
  admin: AuthResponse['data']['user']
) {
  // Create 10 climbs from faker data with the Shape of Tables['climbs'] and Enums['climb_type']
  // created at should be now to 1 week ago
  // created by should be the user id from the auth response
  // start should be in the future, a time between now and 3 weeks from now
  // duration should be between 20 minutes and 5 hours after start
  // type should be one of the climb types enum
  // id should be an auto incrementing integer starting at 1
  // name should be a random string of 10-25 characters with the user's first name in it and fake verb
  // the start time should be between 7am and 10pm, and the duration should be between 20 minutes and 5 hours, but the climb cannot end after 10pm

  if (!admin) {
    throw new Error('no admin')
  }

  const usersClimbs = users
    .map((user) => {
      const climbs = Array.from({ length: 2 }).map((_, i) => {
        const start = add(
          faker.date.between({
            from: new Date(),
            to: add(new Date(), { weeks: 3 }),
          }),
          {
            hours: faker.number.int({ min: 0, max: 4 }),
            minutes: faker.number.int({ min: 0, max: 59 }),
          }
        )

        return {
          created_at: faker.date
            .between({
              from: add(new Date(), { weeks: -1 }),
              to: new Date(),
            })
            .toISOString(),
          created_by: user?.user?.id as string,
          start: start.toISOString(),
          duration: add(start, {
            hours: faker.number.int({ min: 0, max: 4 }),
            minutes: faker.number.int({ min: 0, max: 59 }),
          }).toISOString(),
          type: faker.helpers.arrayElement([
            'boulder',
            'lead_rope',
            'top_rope',
          ]) as Enums<'climb_type'>,
          name: `${user?.user?.user_metadata.first_name
            } ${faker.helpers.arrayElement([
              'climbs',
              'sends',
              'projects',
              'attempts',
            ])} ${faker.helpers.arrayElement([
              'a',
              'the',
              'my',
            ])} ${faker.helpers.arrayElement([
              'red',
              'blue',
              'green',
              'yellow',
              'purple',
              'black',
            ])} ${faker.helpers.arrayElement(['route', 'problem', 'boulder'])}`,
        }
      })

      // make sure admin has a climb from every user
      climbs.push({
        created_at: faker.date
          .between({
            from: add(new Date(), { weeks: -1 }),
            to: new Date(),
          })
          .toISOString(),
        created_by: admin?.id,
        start: add(new Date(), { days: -1 }).toISOString(),
        duration: add(new Date(), { days: -1, hours: 1 }).toISOString(),
        type: faker.helpers.arrayElement([
          'boulder',
          'lead_rope',
          'top_rope',
        ]) as Enums<'climb_type'>,
        name: `${user?.user?.user_metadata.first_name
          } ${faker.helpers.arrayElement([
            'climbs',
            'sends',
            'projects',
            'attempts',
          ])} ${faker.helpers.arrayElement([
            'a',
            'the',
            'my',
          ])} ${faker.helpers.arrayElement([
            'red',
            'blue',
            'green',
            'yellow',
            'purple',
            'black',
          ])} ${faker.helpers.arrayElement(['route', 'problem', 'boulder'])}`,
      })

      return climbs
    })
    .flatMap((climbs) => climbs)

  const { error } = await supabase.from('climbs').insert(usersClimbs)

  if (error) {
    console.error(error)
    return
  }
}

// const { data, error } = await supabase.from('climbs').insert()

async function createMaple(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.auth.signUp({
    email: 'maple@gmail.com',
    password: 'qwerty',
    options: {
      data: {
        first_name: 'Maple',
        last_name: 'Golshani',
        username: 'maple',
        email_confirm: true,
        bio: 'Bork at things. Part marshmallow, part velociraptor.',
        avatar_url:
          'https://github-production-user-asset-6210df.s3.amazonaws.com/2502947/270132245-073cc1ba-4111-4638-a08e-3860f591672e.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230923%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230923T203558Z&X-Amz-Expires=300&X-Amz-Signature=1b6460f5a76c9115bc7a6526d73e32d2f27d3a8657f153571b1cba8b8cbf2a9e&X-Amz-SignedHeaders=host&actor_id=2502947&key_id=0&repo_id=679352400',
      },
    },
  })

  if (error) {
    console.error(error)
    return
  }

  return data
}
async function createMochi(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.auth.signUp({
    email: 'mochi@gmail.com',
    password: 'qwerty',
    options: {
      data: {
        first_name: 'Mochi',
        last_name: 'Golshani',
        username: 'mochi',
        email_confirm: true,
        bio: 'Feces, Pellets, Dander, Hay forever. I will eat the wall',
        avatar_url:
          'https://github-production-user-asset-6210df.s3.amazonaws.com/2502947/270132160-ff02fc5c-bd04-4594-b18b-5c99b081ef84.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230923%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230923T203329Z&X-Amz-Expires=300&X-Amz-Signature=55b93ac333cad1b809adaebd19881d990b8e8dba0f069f02fafc929ce841dab1&X-Amz-SignedHeaders=host&actor_id=2502947&key_id=0&repo_id=679352400',
      },
    },
  })

  if (error) {
    console.error(error)
    return
  }

  return data
}

async function createBenjamin(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.auth.signUp({
    email: 'benschac@gmail.com',
    password: 'qwerty',
    options: {
      data: {
        first_name: 'Benjamin',
        last_name: 'Schachter',
        username: 'benschac',
        email_confirm: true,
        bio: 'I have no friends to climb with so I made this app',
        avatar_url:
          'https://avatars.githubusercontent.com/u/2502947?u=eb345767686e9b8692c6d76955650a41e6e80cf3&v=4',
      },
    },
  })

  if (error) {
    console.error(error)
    return
  }

  return data
}

// Notes: This doesn't work, look into it tomorrow
async function createUsers(supabase: SupabaseClient<Database>, count: number) {
  const users = Array.from({ length: count }).map(async () => {
    const { data } = await supabase.auth.signUp({
      email: faker.internet.email(),
      password: faker.internet.password(),
      options: {
        data: {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          username: faker.internet.userName(),
          avatar_url: faker.image.avatar(),
          bio: faker.person.bio(),
        },
      },
    })
    return data
  })

  const results = await Promise.all(users)
  return results
}

async function createProfileClimbs(
  supabase: SupabaseClient<Database>,
  climbs: Climbs[],
  profiles: Profiles[],
  admin: AuthResponse['data']['user']
) {
  // Create a single profile climb for every climb for every profile
  // Every other profile should have 2 profile climbs for every climb
  // The profile climbs should be created in the last 2 weeks and 2 weeks in the future
  // The first profile climb should be created by the user who created the climb
  // The second profile climb should be created by a random user
  if (!admin) {
    throw new Error('no admin')
  }

  const profileClimbs = climbs
    .map((climb) => {
      const result: Omit<ProfileClimbs, 'id'>[] = []
      const created_at = faker.date
        .between({
          from: add(new Date(), { weeks: -2 }),
          to: add(new Date(), { weeks: 2 }),
        })
        .toISOString()

      // first profile climb, the user who created the climb
      result.push({
        created_at,
        profile_id: climb.created_by,
        climb_id: climb.id,
      })

      // second profile climb, a random user
      // every other climb should have 2 profile climbs

      if (climb.id % 3 === 0) {
        result.push({
          created_at,
          profile_id: admin.id,
          climb_id: climb.id,
        })
      } else if (climb.id % 2 === 0) {
        result.push({
          created_at,
          profile_id: faker.helpers.arrayElement(profiles).id,
          climb_id: climb.id,
        })
      }

      return result
    })
    .flatMap((climbs) => climbs)

  const { error } = await supabase.from('profile_climbs').insert(profileClimbs)

  if (error) {
    console.error(error)
  }
}

async function main() {
  console.error('Running seeds with faker data')
  const benjamin = await createBenjamin(supabaseInstance)
  const mochi = await createMochi(supabaseInstance)
  const maple = await createMaple(supabaseInstance)
  const users = await createUsers(supabaseInstance, 10)

  if (!benjamin) {
    throw new Error('no benjamin')
  }
  if (!mochi) {
    throw new Error('no mochi')
  }

  if (!maple) {
    console.error(maple)
    throw new Error('no maple')
  }

  await createClimbs(supabaseInstance, [mochi, maple], benjamin.user)
  await createClimbs(supabaseInstance, users, benjamin.user)

  const climbs = await supabaseInstance.from('climbs').select('*')
  const profiles = await supabaseInstance.from('profiles').select('*')
  await createProfileClimbs(
    supabaseInstance,
    climbs?.data ?? [],
    profiles.data ?? [],
    benjamin.user
  )
}

main().catch(console.error)