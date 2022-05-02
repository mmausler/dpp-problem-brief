"""empty message

Revision ID: ab138e6bd0c8
Revises: e23ecccb4ccd
Create Date: 2022-04-30 19:52:54.167314

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ab138e6bd0c8'
down_revision = 'e23ecccb4ccd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('fullname', sa.String(length=128), nullable=False),
    sa.Column('email', sa.String(length=128), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('fullname')
    )
    op.create_table('pets',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('dpp_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('type', sa.String(length=128), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('in_custody', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('pets')
    op.drop_table('users')
    # ### end Alembic commands ###
