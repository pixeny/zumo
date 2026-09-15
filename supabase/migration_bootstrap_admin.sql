-- Every signed-up user defaults to role 'agent' (see migration_agent_trigger.sql),
-- so nobody starts out as 'admin' — meaning nobody could use the new
-- admin-only Team actions (change a role, remove an operator) without this.
-- Promote the account you're actually using to run this app.
update profiles set role = 'admin'
where id = (select id from auth.users where email = 'oto.pixeny@gmail.com');
