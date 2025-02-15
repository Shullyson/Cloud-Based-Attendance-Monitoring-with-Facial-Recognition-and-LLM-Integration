import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/src/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/admin',
    icon: icon('dashboard'), // Matches /src/assets/icons/navbar/dashboard.svg
  },
  {
    title: 'Manage Professors',
    path: '/admin/user',
    icon: icon('professor'), // Matches /src/assets/icons/navbar/professor.svg
  },
  {
    title: 'Manage Students',
    path: '/admin/products',
    icon: icon('student'), // Matches /src/assets/icons/navbar/students.svg
  },
  {
    title: 'Manage Courses',
    path: '/admin/blog',
    icon: icon('course2'), // Matches /src/assets/icons/navbar/course.svg
  },
  {
    title: 'Manage Programs',
    path: '/admin/programs',
    icon: icon('program'), // Matches /src/assets/icons/navbar/programs.svg
  },
  {
    title: 'Logout',
    path: '/',
    icon: icon('logout'), // Matches /src/assets/icons/navbar/logout.svg
  },
];

export default navConfig;
