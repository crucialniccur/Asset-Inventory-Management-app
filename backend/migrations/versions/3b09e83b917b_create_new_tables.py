"""create new tables and update enums with proper casting

Revision ID: 3b09e83b917b
Revises: 57b6230e0683
Create Date: 2025-08-06 10:28:17.467090

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '3b09e83b917b'
down_revision = '57b6230e0683'
branch_labels = None
depends_on = None


def upgrade():
    # Create ENUM type userrole (uppercase) if it doesn't exist yet
    userrole_enum = postgresql.ENUM('ADMIN', 'PROCUREMENT', 'FINANCE', 'EMPLOYEE', name='userrole')
    userrole_enum.create(op.get_bind(), checkfirst=True)

    # Create new tables
    op.create_table('budgets',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('total_amount', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table('activity_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('action', sa.String(length=255), nullable=False),
        sa.Column('target_type', sa.String(length=50), nullable=True),
        sa.Column('target_id', sa.Integer(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('asset_images')

    # Alter allocations table
    with op.batch_alter_table('allocations', schema=None) as batch_op:
        batch_op.drop_constraint('allocations_request_id_fkey', type_='foreignkey')
        batch_op.drop_column('request_id')

    # Alter assets table
    with op.batch_alter_table('assets', schema=None) as batch_op:
        batch_op.add_column(sa.Column('brand', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('model_number', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('serial_number', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('condition', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('created_by', sa.Integer(), nullable=True))
        batch_op.alter_column('name',
               existing_type=sa.VARCHAR(length=100),
               type_=sa.String(length=120),
               existing_nullable=False)
        batch_op.alter_column('category_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.create_foreign_key(None, 'users', ['created_by'], ['id'])
        batch_op.drop_column('quantity')

    # Alter categories table
    with op.batch_alter_table('categories', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=sa.VARCHAR(length=80),
               type_=sa.String(length=120),
               existing_nullable=False)
        batch_op.drop_column('created_at')

    # Alter requests table
    with op.batch_alter_table('requests', schema=None) as batch_op:
        batch_op.add_column(sa.Column('asset_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('category_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('request_type', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('justification', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('estimated_cost', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('asset_description', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('brand', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('issue_description', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('approved_at', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('fulfilled_at', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('approved_by', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('finance_approved', sa.Boolean(), nullable=True))
        batch_op.add_column(sa.Column('rejection_comment', sa.Text(), nullable=True))
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('urgency',
               existing_type=postgresql.ENUM('LOW', 'MEDIUM', 'HIGH', name='requesturgency'),
               type_=sa.String(length=50),
               nullable=True)
        batch_op.alter_column('status',
               existing_type=postgresql.ENUM('PENDING', 'APPROVED', 'REJECTED', 'FULFILLED', name='requeststatus'),
               type_=sa.String(length=50),
               nullable=True)
        batch_op.alter_column('asset_name',
               existing_type=sa.VARCHAR(length=100),
               nullable=True)
        batch_op.create_foreign_key(None, 'assets', ['asset_id'], ['id'])
        batch_op.create_foreign_key(None, 'categories', ['category_id'], ['id'])
        batch_op.create_foreign_key(None, 'users', ['approved_by'], ['id'])
        batch_op.drop_column('updated_at')
        batch_op.drop_column('requested_at')
        batch_op.drop_column('type')

    # Fix ENUM casting for 'role' column in users table
    op.execute("""
        ALTER TABLE users
        ALTER COLUMN role
        TYPE userrole
        USING
          CASE LOWER(role::text)
            WHEN 'admin' THEN 'ADMIN'::userrole
            WHEN 'procurement' THEN 'PROCUREMENT'::userrole
            WHEN 'finance' THEN 'FINANCE'::userrole
            WHEN 'employee' THEN 'EMPLOYEE'::userrole
            ELSE NULL
          END
    """)

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('department', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('is_active', sa.Boolean(), nullable=True))
        batch_op.alter_column('name',
               existing_type=sa.VARCHAR(length=100),
               type_=sa.String(length=120),
               existing_nullable=False)


def downgrade():
    # Downgrade users table enum and columns
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('role',
               existing_type=postgresql.ENUM('ADMIN', 'PROCUREMENT', 'FINANCE', 'EMPLOYEE', name='userrole'),
               type_=postgresql.ENUM('admin', 'procurement', 'finance', 'employee', name='user_role_enum'),
               existing_nullable=False)
        batch_op.alter_column('name',
               existing_type=sa.String(length=120),
               type_=sa.VARCHAR(length=100),
               existing_nullable=False)
        batch_op.drop_column('is_active')
        batch_op.drop_column('department')

    # Downgrade requests table changes
    with op.batch_alter_table('requests', schema=None) as batch_op:
        batch_op.add_column(sa.Column('type', postgresql.ENUM('NEWASSET', 'REPAIR', name='requesttype'), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('requested_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('updated_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.alter_column('asset_name',
               existing_type=sa.VARCHAR(length=100),
               nullable=False)
        batch_op.alter_column('status',
               existing_type=sa.String(length=50),
               type_=postgresql.ENUM('PENDING', 'APPROVED', 'REJECTED', 'FULFILLED', name='requeststatus'),
               nullable=False)
        batch_op.alter_column('urgency',
               existing_type=sa.String(length=50),
               type_=postgresql.ENUM('LOW', 'MEDIUM', 'HIGH', name='requesturgency'),
               nullable=False)
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.drop_column('rejection_comment')
        batch_op.drop_column('finance_approved')
        batch_op.drop_column('approved_by')
        batch_op.drop_column('fulfilled_at')
        batch_op.drop_column('approved_at')
        batch_op.drop_column('created_at')
        batch_op.drop_column('issue_description')
        batch_op.drop_column('brand')
        batch_op.drop_column('asset_description')
        batch_op.drop_column('estimated_cost')
        batch_op.drop_column('justification')
        batch_op.drop_column('request_type')
        batch_op.drop_column('category_id')
        batch_op.drop_column('asset_id')

    # Downgrade categories table changes
    with op.batch_alter_table('categories', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
        batch_op.alter_column('name',
               existing_type=sa.String(length=120),
               type_=sa.VARCHAR(length=80),
               existing_nullable=False)

    # Downgrade assets table changes
    with op.batch_alter_table('assets', schema=None) as batch_op:
        batch_op.add_column(sa.Column('quantity', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.alter_column('category_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('name',
               existing_type=sa.String(length=120),
               type_=sa.VARCHAR(length=100),
               existing_nullable=False)
        batch_op.drop_column('created_by')
        batch_op.drop_column('condition')
        batch_op.drop_column('serial_number')
        batch_op.drop_column('model_number')
        batch_op.drop_column('brand')

    # Downgrade allocations table changes
    with op.batch_alter_table('allocations', schema=None) as batch_op:
        batch_op.add_column(sa.Column('request_id', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.create_foreign_key('allocations_request_id_fkey', 'requests', ['request_id'], ['id'])

    # Re-create dropped asset_images table
    op.create_table('asset_images',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('url', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('uploaded_by', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('uploaded_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(['uploaded_by'], ['users.id'], name='asset_images_uploaded_by_fkey'),
        sa.PrimaryKeyConstraint('id', name='asset_images_pkey')
    )
    # Drop tables created in upgrade
    op.drop_table('activity_logs')
    op.drop_table('budgets')
